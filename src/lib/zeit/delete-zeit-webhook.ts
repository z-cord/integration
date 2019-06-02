import fetch from 'node-fetch';

/**

 */
export default async function deleteZeitWebhook(token:String, id:string){
	await fetch(`https://api.zeit.co/v1/integrations/webhooks/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}
