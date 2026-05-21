import { useState, useEffect, useCallback } from 'react';

export interface ReferralSource {
  id: number;
  name: string;
  company: string;
  category: string;
  location: string;
  email: string;
  phone: string;
  stage: string;
  lastContact?: string;
  nextFollowUp: string;
  notes: string;
  qualityScore: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  sourceId: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  company: string;
  notes: string;
}

export interface AgendaDay {
  date: string;
  items: CalendarEvent[];
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('moonshine_referrals');
      if (!storedData) {
        setEvents([]);
        return;
      }

      const sources: ReferralSource[] = JSON.parse(storedData);
      
      const mappedEvents: CalendarEvent[] = sources
        .filter(source => source.nextFollowUp && source.nextFollowUp.trim() !== '')
        .map(source => ({
          id: `evt-${source.id}`,
          title: source.name,
          date: source.nextFollowUp,
          sourceId: source.id,
          priority: source.qualityScore > 80 ? 'high' : source.qualityScore > 50 ? 'medium' : 'low',
          category: source.category,
          company: source.company,
          notes: source.notes
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Moonshine Tracker: Failed to sync calendar events", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    
    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'moonshine_referrals') fetchEvents();
    };

    // Sync within same tab on custom update event
    const handleLocalUpdate = () => fetchEvents();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('referralsUpdated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('referralsUpdated', handleLocalUpdate);
    };
  }, [fetchEvents]);

  /**
   * Groups events into a daily agenda structure
   */
  const getAgenda = (): AgendaDay[] => {
    const grouped: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });

    return Object.entries(grouped)
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  /**
   * Returns events for the next 7 days
   */
  const getWeeklyAgenda = (): AgendaDay[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return getAgenda().filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= today && dayDate <= nextWeek;
    });
  };

  const getMetrics = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      overdueCount: events.filter(e => e.date < todayStr).length,
      upcomingCount: events.filter(e => e.date >= todayStr).length,
      highPriorityCount: events.filter(e => e.priority === 'high').length,
      totalFollowUps: events.length
    };
  };

  return {
    events,
    agenda: getAgenda(),
    weeklyAgenda: getWeeklyAgenda(),
    metrics: getMetrics(),
    refresh: fetchEvents,
    loading
  };
};