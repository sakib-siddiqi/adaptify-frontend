import http from "../config/http.config";

export default class InvoiceService {
    static async generateInvoice(id:number) {
        const {data} = await http.get(`/invoice/${id}`);
        return data; 
    }
}