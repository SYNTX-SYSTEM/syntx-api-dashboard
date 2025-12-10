export interface SystemHealth {
  status: string;
  api_version: string;
  timestamp: string;
  queue_accessible: boolean;
  modules: string[];
}

export interface QueueData {
  status: string;
  system_health: string;
  queue: {
    incoming: number;
    processing: number;
    processed: number;
    errors: number;
  };
  performance: {
    jobs_per_hour: number;
    avg_duration_minutes: number;
    estimated_completion_hours: number;
  };
  recent_completed: RecentJob[];
}

export interface RecentJob {
  filename: string;
  score: number;
  wrapper: string;
  completed_at: string;
  rating: string;
}

export interface EndpointStatus {
  path: string;
  online: boolean | null;
  loading: boolean;
  lastCheck?: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T | null;
  duration: number;
  size: number;
  error?: string;
}
