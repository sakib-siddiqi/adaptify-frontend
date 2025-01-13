import http from "../config/http.config";
import { Status } from "../types";

export default class DocumentHttp {
    static async getAll() {
        const { data } = await http.get('/documents', {})
        return data;
    }
    static async updateStatus({ user_id, value }: { user_id: string, value: Status }) {
        const { data } = await http.patch(`/documents/${user_id}`, {
            status: value,
        });
        return data;
    }
    static async myDocuments() {
        const { data } = await http.get(`/documents/my`);
        return data;
    }
    static getKycURL(file: string) {
        return http.getUri({
            url: `/documents/stream?document=${file}`
        })
    }
}