import { useMutation, useQuery } from "react-query";
import DocumentHttp from "../../../http/document.http";
import Tag from "../../../components/common/tag";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Status } from "../../../types";

const Preview = () => {
    const [preview, setPreview] = useState(false);
    return (
        <>
            <img
                onClick={() => setPreview(true)}
                className="w-20 aspect-video rounded object-contain border-2 border-gray-500 hover:border-indigo-500 cursor-pointer"
                src={'https://anijcfhdvjpaxjqkkbsv.supabase.co/storage/v1/object/public/documents/kyc/222e9b7e-1070-4816-965b-234a5138c269.jpg'}
            />
            <Dialog open={preview} onClose={() => setPreview(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-2 shadow-lg shadow-gray-800 backdrop-blur-md bg-gray-900/50">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-2 rounded-lg">
                        <DialogTitle className="font-bold text-lg flex justify-between">
                            Preview
                            <button onClick={() => setPreview(false)} className="btn size-8 inline-flex justify-center items-center bg-red-100 hover:bg-red-200 text-red-900 px-0 py-0">
                                <XMarkIcon className="size-5" />
                            </button>
                        </DialogTitle>
                        <img
                            className="w-full aspect-video rounded-sm object-contain bg-gray-100 border border-gray-300"
                            src={'https://anijcfhdvjpaxjqkkbsv.supabase.co/storage/v1/object/public/documents/kyc/222e9b7e-1070-4816-965b-234a5138c269.jpg'}
                        />
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

const DocumentsPage = () => {
    const documents = useQuery({
        queryKey: ['documents'],
        queryFn: async () => await DocumentHttp.getAll(),
        refetchOnWindowFocus: false
    })
    const documentsUpdate = useMutation({
        mutationKey: ['document'],
        mutationFn: DocumentHttp.updateStatus,
        onSuccess(){
            documents.refetch()
        }
    });
    function onChangeStatus(id:string, value:string){
        documentsUpdate.mutateAsync({
            user_id : id,
            value : value as Status
        })
    }
    return (
        <main className='py-6 bg-gray-100 min-h-dvh'>
            <div className="container">
                <section className='mb-3'>
                    <h3 className='text-2xl tracking-wide font-bold'>Documents</h3>
                    <p className="text-sm font-medium text-gray-500">All the documents submitted by user for there KYC</p>
                </section>
                <section>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right bg-white text-gray-800">
                            <thead className="text-xs uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        User ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        KYC
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(documents?.data?.data) ?
                                    documents?.data?.data.map((item: any) => (
                                        <tr className="">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium"
                                            >
                                                {item?.user_id}
                                            </th>
                                            <td className="px-6 py-4">
                                                <Preview />
                                            </td>
                                            <td className="px-6 py-4">
                                                <Tag set={{ danger: item.status === 'REJECTED', success: item.status === 'APPROVED', warn: item.status === 'PENDING' }}>
                                                    {item?.status}
                                                </Tag>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select defaultValue={item?.status} disabled={documentsUpdate.isLoading} onChange={(event)=>onChangeStatus(item?.user_id,event?.target?.value)} className="input w-auto px-1">
                                                    <option value="PENDING">    🟡 Pending</option>
                                                    <option value="APPROVED">   🟢 Approved</option>
                                                    <option value="REJECTED">   🔴 Rejected</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )) : null}
                            </tbody>
                        </table>
                    </div>

                </section>
            </div>
        </main>
    );
};

export default DocumentsPage;