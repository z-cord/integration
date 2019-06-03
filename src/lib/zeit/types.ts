export interface Token {
	access_token: string;
	token_type: 'Bearer';
	installation_id: string;
	user_id: string;
	team_id?: string | null;
}

export interface User {
	 user: {
		uid : string;
		email : string;
		name : string;
		username : string;
		avatar : string;
		platformVersion :number; 
		billing :{
			plan: string;
			period?: null,
			trial?: null,
			cancelation?: null,
			addons?: null
		},
		bio : string;
		website : string;
		profiles : {
			service : string;
			link : string;
		}[];
	}
}