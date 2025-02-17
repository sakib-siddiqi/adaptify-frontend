import { useMutation, useQuery, useQueryClient } from "react-query";
import PaymentHttp from "../../http/payment.http";
import Tag from "../../components/common/tag";
import { useForm } from "react-hook-form";
import { PaymentCreate } from "../../types";

const MakeRequest = () => {
    const queryClient = useQueryClient();
    const FORM = useForm<PaymentCreate>();
    const paymentCreate = useMutation({
        mutationKey: ['payment-create'],
        mutationFn: PaymentHttp.createOne,
        onSuccess() {
            queryClient.invalidateQueries('payments');
            FORM.reset();
        }
    });
    const onSubmit = (data: PaymentCreate) => paymentCreate.mutateAsync(data);
    return (
        <form onSubmit={FORM.handleSubmit(onSubmit)}>
            {paymentCreate.isError && <div className="px-2 py-1 mb-1 border border-red-200 rounded bg-red-50 text-red-700 text-sm font-medium">
                {JSON.stringify((paymentCreate.error as any)?.response?.data?.message || (paymentCreate?.error as any)?.message, null, 2)}
            </div>}
            <div className="flex gap-2 flex-col items-baseline md:flex-row mb-3">
                <div className="w-full">
                    <label className="text-sm font-medium mb-1">Title *</label>
                    <input {...FORM.register('title', { required: true })} type="text" className="input flex-grow" placeholder="Title" />
                </div>
                <div className="flex gap-2 items-end">
                    <div className="w-full">
                        <label className="text-sm font-medium mb-1">Amount($) *</label>
                        <input {...FORM.register('amount', { required: true, valueAsNumber: true })} type="number" step={0.5} className="input md:w-36" placeholder="Amount" defaultValue={0} />
                    </div>
                    <button type="submit" disabled={paymentCreate.isLoading} className="btn mb-0.5">{paymentCreate.isLoading ? 'Loading...' : 'Request'}</button>
                </div>
            </div>
        </form>
    )
}

const HomePage = () => {
    const payments = useQuery({
        queryKey: ['payments'],
        queryFn: async () => await PaymentHttp.getAll(),
        refetchOnWindowFocus: false
    });
    return (
        <main className='py-6 bg-gray-100 min-h-dvh'>
            <div className="container">
                <section className='mb-3'>
                    <h3 className='text-2xl tracking-wide font-bold'>Payment</h3>
                    <p className="text-sm font-medium text-gray-500">All payment requests.</p>
                </section>
                <MakeRequest />
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
                                            <td className="px-6 py-4 text-right">
                                                {item?.status === 'APPROVED' ? (
                                                    <button className="btn text-xs py-1.5 px-3 tracking-wider">
                                                        PAY
                                                    </button>
                                                ) : null}
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

export default HomePage;
