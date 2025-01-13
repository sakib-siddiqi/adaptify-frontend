import { useQuery } from 'react-query';
import supabase from '../../config/supabase';
import { NavLink } from 'react-router';
import Tag from '../../components/common/tag';
import DocumentHttp from '../../http/document.http';
import classNames from 'classnames';

const ProfilePage = () => {
    const user = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error.message;
            return data?.user;
        },
        refetchOnWindowFocus: false
    })
    const myDocuments = useQuery({
        queryKey: ['user', 'documents'],
        queryFn: async () => {
            const data = await DocumentHttp.myDocuments();
            return data?.data;
        },
        refetchOnWindowFocus: false
    })
    return (
        <div className='container py-10 !max-w-xl'>
            <form>
                <div className='mb-3'>
                    <label className="mb-1 text-sm font-medium" htmlFor="user-id">User ID</label>
                    <input
                        id="user-di"
                        type="text"
                        className="input"
                        readOnly
                        value={user?.data?.id}
                    />
                </div>
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
                <div className='mt-3'>
                    <label className={classNames("mb-1 text-sm font-medium", myDocuments.isError ? 'text-red-500' : '')} htmlFor="email">
                        KYC {myDocuments.isError ? `(${(myDocuments?.error as any)?.response?.message || (myDocuments?.error as any)?.message})` : null}
                        <Tag set={{
                            danger: myDocuments?.data?.status === 'REJECTED',
                            success: myDocuments?.data?.status === 'APPROVED',
                            warn: myDocuments?.data?.status === 'PENDING'
                        }}>
                            {myDocuments?.data?.status}
                        </Tag>
                    </label>
                    <img
                        src={myDocuments?.data?.document}
                        className='aspect-video rounded-md bg-white border border-gray-300 object-contain'
                    />
                </div>
                <NavLink to="./edit" className="btn mt-2 w-full block text-center">
                    EDIT
                </NavLink>
            </form>
        </div>
    );
};

export default ProfilePage;