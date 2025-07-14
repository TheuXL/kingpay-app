export interface UtmFyTracker {
  id?: string;
  name: string;
  platform: string;
  pixel_id: string;
  api_key: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface UtmFyTrackerResponse {
  success: boolean;
  data?: UtmFyTracker | UtmFyTracker[];
  error?: {
    message: string;
    code?: string;
  };
}

export interface CreateUtmFyTrackerRequest {
  name: string;
  platform: string;
  pixel_id: string;
  api_key: string;
}

export interface UpdateUtmFyTrackerRequest {
  id: string;
  name?: string;
  platform?: string;
  pixel_id?: string;
  api_key?: string;
} 