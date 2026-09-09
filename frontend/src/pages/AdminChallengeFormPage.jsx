import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import InlineNotice from '../components/ui/InlineNotice';
import AdminFormSkeleton from '../components/admin/AdminFormSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { CATEGORIES, DIFFICULTIES } from '../lib/mockChallenges';
import { ADMIN_CHALLENGES, CHALLENGE_TYPES, emptyFormValues } from '../lib/mockAdminContent';
import { slideUp, staggerContainer } from '../lib/motion';
import { cn } from '../lib/utils';

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.label, label: c.label }));
const DIFFICULTY_OPTIONS = DIFFICULTIES.map((d) => ({ value: d, label: d }));
const TYPE_OPTIONS = CHALLENGE_TYPES.map((t) => ({ value: t, label: t }));

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Title is required';
  if (!values.category) errors.category = 'Select a category';
  if (!values.estimatedTime.trim()) errors.estimatedTime = 'Estimated time is required';
  if (!values.description.trim()) errors.description = 'Description is required';

  if (values.type === 'MCQ') {
    if (values.options.some((o) => !o.trim())) errors.options = 'Fill in all four options';
  } else if (values.type === 'Output') {
    if (!values.codeSnippet.trim()) errors.codeSnippet = 'Code snippet is required';
    if (!values.expectedOutput.trim()) errors.expectedOutput = 'Expected output is required';
  } else if (values.type === 'Debugging') {
    if (!values.buggyCode.trim()) errors.buggyCode = 'Buggy code is required';
    if (!values.expectedFix.trim()) errors.expectedFix = 'Describe the expected fix';
  } else if (values.type === 'SQL') {
    if (!values.schema.trim()) errors.schema = 'Schema / setup is required';
    if (!values.expectedResult.trim()) errors.expectedResult = 'Expected result is required';
  } else {
    if (!values.starterCode.trim()) errors.starterCode = 'Starter code is required';
    if (values.testCases.some((t) => !t.input.trim() || !t.expected.trim())) {
      errors.testCases = 'Fill in every test case field';
    }
  }

  return errors;
}

export default function AdminChallengeFormPage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(challengeId);
  const loading = useMockLoading(isEditMode ? 500 : 0);
  const existing = isEditMode ? ADMIN_CHALLENGES.find((c) => c.id === Number(challengeId)) : null;

  const [values, setValues] = useState(() => {
    const base = emptyFormValues(existing?.type ?? 'Coding');
    return existing ? { ...base, title: existing.title, category: existing.category, type: existing.type } : base;
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleTypeChange(nextType) {
    setValues((v) => ({
      ...emptyFormValues(nextType),
      title: v.title,
      category: v.category,
      difficulty: v.difficulty,
      estimatedTime: v.estimatedTime,
      description: v.description,
    }));
  }

  function updateTestCase(index, field, value) {
    setValues((v) => ({
      ...v,
      testCases: v.testCases.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc)),
    }));
  }

  function addTestCase() {
    setValues((v) => ({ ...v, testCases: [...v.testCases, { input: '', expected: '' }] }));
  }

  function removeTestCase(index) {
    setValues((v) => ({ ...v, testCases: v.testCases.filter((_, i) => i !== index) }));
  }

  function updateOption(index, value) {
    setValues((v) => ({ ...v, options: v.options.map((o, i) => (i === index ? value : o)) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setNotice("Saving isn't wired up yet — coming soon. Nothing was persisted.");
    }, 700);
  }

  if (loading) {
    return <AdminFormSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp}>
        <button
          type="button"
          onClick={() => navigate('/app/admin/content')}
          className="flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} /> Back to content
        </button>
        <h1 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">
          {isEditMode ? 'Edit Challenge' : 'New Challenge'}
        </h1>
        <p className="mt-1 text-secondary">
          {isEditMode
            ? 'Editing loads what we have for this challenge — some fields start blank in this mock.'
            : 'Fields change based on the challenge type you pick.'}
        </p>
      </motion.div>

      <motion.form variants={slideUp} onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-6">
        <Card className="flex flex-col gap-4 p-5 sm:p-6">
          <h2 className="font-semibold text-primary">Details</h2>
          <Input label="Title" value={values.title} onChange={(e) => update('title', e.target.value)} error={errors.title} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Type</label>
              <Select options={TYPE_OPTIONS} value={values.type} onChange={(e) => handleTypeChange(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Category</label>
              <Select
                options={[{ value: '', label: 'Select category' }, ...CATEGORY_OPTIONS]}
                value={values.category}
                onChange={(e) => update('category', e.target.value)}
              />
              {errors.category && <span className="text-xs text-danger">{errors.category}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Difficulty</label>
              <Select
                options={DIFFICULTY_OPTIONS}
                value={values.difficulty}
                onChange={(e) => update('difficulty', e.target.value)}
              />
            </div>
          </div>

          <Input
            label="Estimated time"
            placeholder="e.g. 20 min"
            value={values.estimatedTime}
            onChange={(e) => update('estimatedTime', e.target.value)}
            error={errors.estimatedTime}
          />
          <Textarea
            label="Description"
            rows={4}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            error={errors.description}
          />
        </Card>

        {values.type === 'MCQ' && (
          <Card className="flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="font-semibold text-primary">Answer options</h2>
            <p className="text-sm text-secondary">Select the radio button next to the correct answer.</p>
            <div className="flex flex-col gap-3">
              {values.options.map((option, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => update('correctOption', i)}
                    aria-label={`Mark option ${i + 1} as correct`}
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                      values.correctOption === i
                        ? 'border-accent bg-accent text-accent-contrast'
                        : 'border-glass-strong text-transparent hover:border-accent'
                    )}
                  >
                    <Check size={14} />
                  </button>
                  <Input
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            {errors.options && <span className="text-xs text-danger">{errors.options}</span>}
          </Card>
        )}

        {values.type === 'Output' && (
          <Card className="flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="font-semibold text-primary">Code &amp; expected output</h2>
            <Textarea
              label="Code snippet"
              rows={6}
              mono
              value={values.codeSnippet}
              onChange={(e) => update('codeSnippet', e.target.value)}
              error={errors.codeSnippet}
            />
            <Input
              label="Expected output"
              mono
              value={values.expectedOutput}
              onChange={(e) => update('expectedOutput', e.target.value)}
              error={errors.expectedOutput}
            />
          </Card>
        )}

        {values.type === 'Debugging' && (
          <Card className="flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="font-semibold text-primary">Buggy code</h2>
            <Textarea
              label="Buggy code"
              rows={6}
              mono
              value={values.buggyCode}
              onChange={(e) => update('buggyCode', e.target.value)}
              error={errors.buggyCode}
            />
            <Textarea
              label="Expected fix"
              rows={3}
              value={values.expectedFix}
              onChange={(e) => update('expectedFix', e.target.value)}
              error={errors.expectedFix}
            />
          </Card>
        )}

        {values.type === 'SQL' && (
          <Card className="flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="font-semibold text-primary">Schema &amp; expected result</h2>
            <Textarea
              label="Schema / setup"
              rows={5}
              mono
              value={values.schema}
              onChange={(e) => update('schema', e.target.value)}
              error={errors.schema}
            />
            <Textarea
              label="Expected query or result"
              rows={4}
              mono
              value={values.expectedResult}
              onChange={(e) => update('expectedResult', e.target.value)}
              error={errors.expectedResult}
            />
          </Card>
        )}

        {values.type === 'Coding' && (
          <Card className="flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="font-semibold text-primary">Starter code &amp; test cases</h2>
            <Textarea
              label="Starter code"
              rows={6}
              mono
              value={values.starterCode}
              onChange={(e) => update('starterCode', e.target.value)}
              error={errors.starterCode}
            />

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-secondary">Test cases</label>
              {values.testCases.map((tc, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    placeholder="Input"
                    mono
                    value={tc.input}
                    onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Expected output"
                    mono
                    value={tc.expected}
                    onChange={(e) => updateTestCase(i, 'expected', e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeTestCase(i)}
                    disabled={values.testCases.length === 1}
                    aria-label="Remove test case"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glass text-secondary transition-colors hover:border-[var(--border-danger)] hover:text-danger disabled:cursor-default disabled:opacity-40"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              {errors.testCases && <span className="text-xs text-danger">{errors.testCases}</span>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={addTestCase}
                className="self-start"
              >
                Add test case
              </Button>
            </div>
          </Card>
        )}

        <InlineNotice message={notice} />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Challenge'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/app/admin/content')}>
            Cancel
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
