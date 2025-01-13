import supabase from "../config/supabase";

export default class SupabaseService {
    static async uploadImage(file: File) {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (!user?.user?.id) {
            console.error(userError);
            return null;
        }
        const splited = file.name.split('.');
        const ext = splited[splited.length - 1];
        const { data, error } = await supabase.storage.from('documents').upload(`kyc/${user.user.id}${ext ? `.${ext}` : ''}`, file, {
            upsert: true,
        });
        if (error) return null;
        const { data: insertData } = await supabase
            .from('documents')
            .upsert([
                {
                    user_id: user?.user?.id,
                    document: data.path,
                    status: 'PENDING'
                }
            ]);
        return {
            storage: {
                data
            },
            documents: {
                data: insertData
            }
        };
    }
}