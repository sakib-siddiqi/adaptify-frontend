import { useMutation, useQuery } from 'react-query';
import supabase from '../../config/supabase';
import FileUpload from '../../components/common/file-upload';
import { useForm } from 'react-hook-form';
import SupabaseService from '../../services/supabase.service';

interface FormInput {
    kyc: File | undefined
}
const EditProfilePage = () => {
    const FORM = useForm<FormInput>()
    const user = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error.message;
            return data?.user;
        },
        refetchOnWindowFocus: false,
    });
    const uploadKYC = useMutation({
        mutationKey: ['kyc'],
        mutationFn: async (kyc: File) => {
            await SupabaseService.uploadImage(kyc as File);
        },
    });
    async function onSubmit(data: FormInput) {
        try {
            if (!data.kyc) return FORM.setError('kyc', {
                message: 'Please upload kyc',
                type: 'KYC_UPLOAD_ERROR'
            })
            uploadKYC.mutateAsync(data.kyc);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='container py-10 !max-w-xl'>
            <form onSubmit={FORM.handleSubmit(onSubmit)}>
                <div>
                    <label className="mb-1 text-sm font-medium" htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        readOnly
                        value={user?.data?.email}
                        placeholder="example@mail.com"
                    />
                </div>
                <FileUpload onChange={(file: File) => FORM.setValue('kyc', file)} />
                    {uploadKYC.isError && <p className="px-2 py-1 rounded bg-red-50 text-red-800">
                        {(uploadKYC.error as any)?.message}
                    </p>}
                <button className="btn mt-2">
                    {uploadKYC.isLoading ? "Loading..." : "SUBMIT"}
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;