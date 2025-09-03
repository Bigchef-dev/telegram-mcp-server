/**
 * Chat Related Types
 * Chat entities, members, and permissions
 */

import { TelegramUser } from './core.types.js';

/**
 * Chat representation
 */
export interface Chat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Chat member with permissions
 */
export interface ChatMember {
  user: TelegramUser;
  status: string;
  custom_title?: string;
  is_anonymous?: boolean;
  can_be_edited?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  is_member?: boolean;
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  until_date?: number;
}

/**
 * Chat member update event
 */
export interface ChatMemberUpdated {
  chat: Chat;
  from: TelegramUser;
  date: number;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
  invite_link?: ChatInviteLink;
  via_chat_folder_invite_link?: boolean;
}

/**
 * Chat invite link
 */
export interface ChatInviteLink {
  invite_link: string;
  creator: TelegramUser;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  pending_join_request_count?: number;
}

/**
 * Chat join request
 */
export interface ChatJoinRequest {
  chat: Chat;
  from: TelegramUser;
  user_chat_id: number;
  date: number;
  bio?: string;
  invite_link?: ChatInviteLink;
}

/**
 * Full information about a chat
 */
export interface ChatFullInfo extends Chat {
  accent_color_id?: number;
  max_reaction_count?: number;
  photo?: {
    small_file_id: string;
    small_file_unique_id: string;
    big_file_id: string;
    big_file_unique_id: string;
  };
  active_usernames?: string[];
  birthdate?: {
    day: number;
    month: number;
    year?: number;
  };
  business_intro?: {
    title?: string;
    message?: string;
    sticker?: object;
  };
  business_location?: {
    address: string;
    location?: object;
  };
  business_opening_hours?: {
    time_zone_name: string;
    opening_hours: Array<{
      opening_minute: number;
      closing_minute: number;
    }>;
  };
  personal_chat?: Chat;
  available_reactions?: object[];
  background_custom_emoji_id?: string;
  profile_accent_color_id?: number;
  profile_background_custom_emoji_id?: string;
  emoji_status_custom_emoji_id?: string;
  emoji_status_expiration_date?: number;
  bio?: string;
  has_private_forwards?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  pinned_message?: object;
  permissions?: {
    can_send_messages?: boolean;
    can_send_audios?: boolean;
    can_send_documents?: boolean;
    can_send_photos?: boolean;
    can_send_videos?: boolean;
    can_send_video_notes?: boolean;
    can_send_voice_notes?: boolean;
    can_send_polls?: boolean;
    can_send_other_messages?: boolean;
    can_add_web_page_previews?: boolean;
    can_change_info?: boolean;
    can_invite_users?: boolean;
    can_pin_messages?: boolean;
    can_manage_topics?: boolean;
  };
  slow_mode_delay?: number;
  unrestrict_boost_count?: number;
  message_auto_delete_time?: number;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  has_visible_history?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  custom_emoji_sticker_set_name?: string;
  linked_chat_id?: number;
  location?: {
    longitude: number;
    latitude: number;
    title?: string;
    address?: string;
  };
}

/**
 * Parameters for getting chat information
 */
export interface GetChatParams {
  chat_id: number | string;
}
