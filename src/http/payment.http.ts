import http from "../config/http.config";
import { PaymentCreate, Status } from "../types";

export default class PaymentHttp {
    static async getAll() {
        const { data } = await http.get('/payments', {})
        return data;
    }
    static async createOne(data: PaymentCreate) {
        const response = await http.post('/payments', data)
        return response.data;
    }
    static async updateStatus({ user_id, value }: { user_id: string, value: Status }) {
        const { data } = await http.patch(`/payments/${user_id}`, {
            status: value,
        });
        return data;
    }
}