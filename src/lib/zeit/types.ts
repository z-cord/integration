export interface Token {
	access_token: string;
	token_type: 'Bearer';
	installation_id: string;
	user_id: string;
	team_id?: string | null;
}