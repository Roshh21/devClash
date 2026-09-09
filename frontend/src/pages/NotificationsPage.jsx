import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyTabState from '../components/ui/EmptyTabState';
import NotificationRow from '../components/notifications/NotificationRow';
import NotificationsSkeleton from '../components/notifications/NotificationsSkeleton';
import { useMockLoading } from '../lib/useMockLoading';
import { NOTIFICATIONS as INITIAL_NOTIFICATIONS } from '../lib/mockNotifications';
import { slideUp, staggerContainer } from '../lib/motion';

export default function NotificationsPage() {
  const loading = useMockLoading();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  function markAllRead() {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <NotificationsSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div variants={slideUp} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-secondary">Friend requests, invites, and match results.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" leftIcon={<CheckCheck size={15} />} onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </motion.div>

      <motion.div variants={slideUp}>
        <Card className="mt-6 max-w-2xl overflow-hidden">
          {notifications.length > 0 ? (
            <div className="divide-y divide-glass">
              {notifications.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <EmptyTabState icon={Bell} label="You're all caught up" description="New notifications will show up here." />
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
