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
