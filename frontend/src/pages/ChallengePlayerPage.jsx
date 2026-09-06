import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2, History, MessageSquare, Play, PartyPopper } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Select from '../components/ui/Select';
import EmptyTabState from '../components/ui/EmptyTabState';
import ThemeToggle from '../components/ui/ThemeToggle';
import CodeEditor from '../components/challenge/CodeEditor';
import TimerChip from '../components/challenge/TimerChip';
import StatusPill from '../components/challenge/StatusPill';
import { getChallengeDetail } from '../lib/mockChallengeDetail';
import { slideUp } from '../lib/motion';

const DIFFICULTY_VARIANT = { Easy: 'success', Medium: 'warning', Hard: 'danger' };

const PROBLEM_TABS = [
  { id: 'problem', label: 'Problem' },
  { id: 'submissions', label: 'Submissions' },
  { id: 'discussion', label: 'Discussion' },
];

const RESULT_TABS = [
  { id: 'tests', label: 'Test Cases' },
  { id: 'result', label: 'Result' },
];

export default function ChallengePlayerPage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const challenge = getChallengeDetail(challengeId);

  const [code, setCode] = useState(challenge.starterCode);
  const [problemTab, setProblemTab] = useState('problem');
  const [resultTab, setResultTab] = useState('tests');
  const [running, setRunning] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [testStatuses, setTestStatuses] = useState({ 1: 'passed', 2: 'passed', 3: 'running' });

  function runSequence(onDone) {
    if (running) return;
    setRunning(true);
    setSubmitResult(null);
    const ids = challenge.testCases.map((t) => t.id);
    setTestStatuses(Object.fromEntries(ids.map((id) => [id, 'running'])));

    ids.forEach((id, i) => {
      window.setTimeout(
        () => {
          setTestStatuses((prev) => ({ ...prev, [id]: 'passed' }));
          if (i === ids.length - 1) {
            setRunning(false);
            onDone?.();
          }
        },
        600 + i * 500
      );
    });
  }

  function handleRun() {
    setResultTab('tests');
    runSequence();
  }

  function handleSubmit() {
    setResultTab('result');
    runSequence(() => setSubmitResult('success'));
  }

  return (
    <div className="flex h-screen flex-col bg-bg text-primary">
      <header className="flex items-center gap-3 border-b border-glass bg-[var(--color-nav-bg)] px-4 py-3 backdrop-blur-glass sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <Code2 size={16} />
          </span>
          <span className="hidden sm:inline">DevClash</span>
        </Link>
        <button
          type="button"
          onClick={() => navigate('/app/practice')}
          className="flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} /> Back to challenges
        </button>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <TimerChip />
          <Button size="sm" onClick={handleSubmit} disabled={running}>
            Submit
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_1.3fr_1fr] lg:overflow-hidden">
        <section className="border-b border-glass p-5 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <Tabs tabs={PROBLEM_TABS} active={problemTab} onChange={setProblemTab} />
          <div className="pt-5">
            {problemTab === 'problem' && (
              <motion.div initial="hidden" animate="visible" variants={slideUp}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={DIFFICULTY_VARIANT[challenge.difficulty]}>{challenge.difficulty}</Badge>
                  {challenge.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <h1 className="mt-3 text-xl font-bold text-primary">{challenge.title}</h1>
                <p className="mt-4 text-sm leading-relaxed text-secondary">{challenge.description}</p>

                {challenge.examples.map((example, i) => (
                  <div key={i} className="mt-5">
                    <p className="text-sm font-semibold text-primary">Example {i + 1}:</p>
                    <div className="mt-2 space-y-1 rounded-xl border border-glass bg-surface p-3 font-mono text-xs text-secondary">
                      <p>
                        <span className="text-tertiary">Input: </span>
                        {example.input}
                      </p>
                      <p>
                        <span className="text-tertiary">Output: </span>
                        {example.output}
                      </p>
                      {example.explanation && (
                        <p>
                          <span className="text-tertiary">Explanation: </span>
                          {example.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {problemTab === 'submissions' && (
              <EmptyTabState
                icon={History}
                label="No submissions yet"
                description="Every attempt you submit will be listed here."
              />
            )}

            {problemTab === 'discussion' && (
              <EmptyTabState
                icon={MessageSquare}
                label="Discussion is on the way"
                description="Tips and approaches from other developers will show up here."
              />
            )}
          </div>
        </section>

        <section className="flex flex-col border-b border-glass lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-glass p-3">
            <Select
              value="javascript"
              onChange={() => {}}
              options={[{ value: 'javascript', label: 'JavaScript' }]}
              className="w-40"
            />
          </div>
          <div className="h-[360px] lg:h-auto lg:flex-1">
            <CodeEditor value={code} onChange={(v) => setCode(v ?? '')} />
          </div>
          <div className="flex items-center gap-3 border-t border-glass p-3">
            <Button
              variant="outline"
              leftIcon={<Play size={15} />}
              onClick={handleRun}
              disabled={running}
              className="flex-1"
            >
              Run Code
            </Button>
            <Button onClick={handleSubmit} disabled={running} className="flex-1">
              Submit
            </Button>
          </div>
        </section>

        <section className="p-5 lg:overflow-y-auto">
          <Tabs tabs={RESULT_TABS} active={resultTab} onChange={setResultTab} />
          <div className="pt-5">
            {resultTab === 'tests' ? (
              <div className="space-y-3">
                {challenge.testCases.map((testCase, i) => (
                  <div key={testCase.id} className="rounded-xl border border-glass bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">Test Case {i + 1}</span>
                      <StatusPill status={testStatuses[testCase.id] ?? 'idle'} />
                    </div>
                    <p className="mt-2 font-mono text-xs text-secondary">Input: {testCase.input}</p>
                    <p className="mt-1 font-mono text-xs text-secondary">Expected: {testCase.expected}</p>
                  </div>
                ))}
              </div>
            ) : submitResult === 'success' ? (
              <Card className="flex flex-col items-center gap-2 p-6 text-center">
                <PartyPopper size={26} className="text-accent" />
                <p className="font-semibold text-primary">All test cases passed!</p>
                <p className="text-sm text-secondary">
                  Nice work — this result isn&rsquo;t saved anywhere yet.
                </p>
              </Card>
            ) : (
              <EmptyTabState
                icon={Play}
                label="No submission yet"
                description="Run or submit your code to see a result here."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
