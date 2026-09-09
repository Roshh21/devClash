import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import EmptyTabState from '../components/ui/EmptyTabState';
import InlineNotice from '../components/ui/InlineNotice';
import FriendRow from '../components/social/FriendRow';
import RequestRow from '../components/social/RequestRow';
import FriendsSkeleton from '../components/social/FriendsSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { FRIENDS, FRIEND_REQUESTS, USER_DIRECTORY } from '../lib/mockSocial';
import { slideUp, staggerContainer, tabContentTransition } from '../lib/motion';

export default function FriendsPage() {
  const loading = useMockLoading();
  const [activeTab, setActiveTab] = useState('friends');
  const [query, setQuery] = useState('');
  const [requests, setRequests] = useState(FRIEND_REQUESTS);
  const [sentRequests, setSentRequests] = useState([]);
  const [notice, setNotice] = useState(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return USER_DIRECTORY.filter((u) => u.name.toLowerCase().includes(q));
  }, [query]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  }

  function handleAddFriend(user) {
    setSentRequests((ids) => [...ids, user.id]);
    showNotice(`Friend request to ${user.name} isn't wired up yet — coming soon.`);
  }

  function handleAccept(request) {
    setRequests((list) => list.filter((r) => r.id !== request.id));
    showNotice(`Accepting ${request.name} isn't wired up yet — coming soon.`);
  }

  function handleDecline(request) {
    setRequests((list) => list.filter((r) => r.id !== request.id));
    showNotice(`Declined ${request.name}'s request.`);
  }

  function handleChallenge(friend) {
    showNotice(`Challenging ${friend.name} directly isn't wired up yet — coming soon.`);
  }

  function handleMessage(friend) {
    showNotice(`Messaging ${friend.name} isn't wired up yet — coming soon.`);
  }

  if (loading) {
    return <FriendsSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp}>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Friends</h1>
        <p className="mt-1 text-secondary">Connect with other developers and see who's online.</p>
      </motion.div>

      <motion.div variants={slideUp} className="relative mt-6 max-w-md">
        <Input
          icon={<Search size={16} />}
          placeholder="Search for developers to add..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searchResults.length > 0 && (
          <Card className="absolute z-10 mt-2 w-full space-y-1 p-2">
            {searchResults.map((user) => {
              const alreadySent = sentRequests.includes(user.id);
              return (
                <div key={user.id} className="flex items-center gap-3 rounded-xl p-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-bold text-secondary">
                    {user.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">{user.name}</p>
                    <p className="text-xs text-secondary">{user.rating.toLocaleString()} rating</p>
                  </div>
                  <button
                    type="button"
                    disabled={alreadySent}
                    onClick={() => handleAddFriend(user)}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-glass px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-surface hover:text-primary disabled:cursor-default disabled:opacity-60"
                  >
                    <UserPlus size={13} />
                    {alreadySent ? 'Request sent' : 'Add'}
                  </button>
                </div>
              );
            })}
          </Card>
        )}
      </motion.div>

      <InlineNotice message={notice} className="max-w-md" />

      <motion.div variants={slideUp} className="mt-8 max-w-xl">
        <Tabs
          tabs={[
            { id: 'friends', label: `Friends (${FRIENDS.length})` },
            { id: 'requests', label: `Requests${requests.length ? ` (${requests.length})` : ''}` },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={tabContentTransition.initial}
            animate={tabContentTransition.animate}
            exit={tabContentTransition.exit}
            transition={tabContentTransition.transition}
            className="mt-4 flex flex-col gap-3"
          >
            {activeTab === 'friends' &&
              FRIENDS.map((friend) => (
                <FriendRow
                  key={friend.id}
                  friend={friend}
                  onChallenge={handleChallenge}
                  onMessage={handleMessage}
                />
              ))}

            {activeTab === 'requests' &&
              (requests.length > 0 ? (
                requests.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                ))
              ) : (
                <EmptyTabState
                  icon={UserPlus}
                  label="No pending requests"
                  description="New friend requests will show up here."
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
