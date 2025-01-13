import { useMutation, useQuery } from "react-query";
import PaymentHttp from "../../../http/payment.http";
import Tag from "../../../components/common/tag";
import { NewspaperIcon } from "@heroicons/react/16/solid";
import http from "../../../config/http.config";
import { Status } from "../../../types";


const AdminPayments = () => {
    const payments = useQuery({
        queryKey: ['payments'],
        queryFn: async () => await PaymentHttp.getAll(),
        refetchOnWindowFocus: false
    });
    const paymentMutation = useMutation({
        mutationKey: ['payments', 'status'],
        mutationFn: PaymentHttp.updateStatus,
        onSuccess() {
            payments.refetch()
        }
    });
    function onChangeStatus(id: string, value: Status) {
        paymentMutation.mutateAsync({
            user_id: id,
            value: value
        })
    }
    function getInvoice(id: number) {
        const a = document.createElement('a');
        a.href = `${http.getUri()}/invoice/${id}`;
        a.target = "_blank";
        a.click();
    }
    return (
        <main className='py-6 bg-gray-100 min-h-dvh'>
            <div className="container">
                <section className='mb-3'>
                    <h3 className='text-2xl tracking-wide font-bold'>Payment</h3>
                    <p className="text-sm font-medium text-gray-500">All payment requests.</p>
                </section>
                <section>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right bg-white text-gray-800">
                            <thead className="text-xs uppercase border-b border-b-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3 min-w-52">
                                        title
                                    </th>
                                    <th scope="col" className="px-6 py-3 w-36">
                                        amount ($)
                                    </th>
                                    <th scope="col" className="px-6 py-3 w-36">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3  w-28 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments?.isLoading ? (
                                    <p className="text-sm font-medium px-5 py-2">Loading...</p>
                                ) : null}
                                {Array.isArray(payments?.data?.data) ?
                                    payments?.data?.data.map((item: any) => (
                                        <tr className="">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium"
                                            >
                                                {item?.title}
                                            </th>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium"
                                            >
                                                ${Number(item?.amount).toFixed(2)}
                                            </th>
                                            <td className="px-6 py-4">
                                                <Tag set={{ danger: item.status === 'REJECTED', success: item.status === 'APPROVED', warn: item.status === 'PENDING' }}>
                                                    {item?.status}
                                                </Tag>
                                            </td>
                                            <td className="px-6 py-4 text-right flex gap-1 items-center">
                                                <select defaultValue={item?.status} disabled={paymentMutation.isLoading} onChange={(event) => onChangeStatus(item?.id, event?.target?.value as Status)} className="input text-sm px-1 pl-0 py-0.5 w-auto">
                                                    <option value="PENDING">    🟡 Pending</option>
                                                    <option value="APPROVED">   🟢 Approved</option>
                                                    <option value="REJECTED">   🔴 Rejected</option>
                                                </select>
                                                <button onClick={() => getInvoice(item?.id)} className="btn text-xs py-1 px-1 tracking-wider">
                                                    <NewspaperIcon className="size-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : null}
                            </tbody>
                        </table>
                    </div>

                </section>
            </div>
        </main>
    )
};

export default AdminPayments;
