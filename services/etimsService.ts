import type { Ticket } from '../types';

// This is a custom error class to mimic the behavior of the PHP ApiException
export class EtimsApiException extends Error {
    constructor(message: string, public code: string, public details?: any) {
        super(message);
        this.name = 'EtimsApiException';
    }
}

// This interface is based on the 'salesTrns' schema in the PHP Validator
interface SalesTransactionPayload {
    tin: string;
    bhfId: string;
    invcNo: string;
    salesTrnsItems: {
        itemCd: string;
        itemNm: string;
        qty: number;
        prc: number;
        splyAmt: number;
        dcRt?: number;
        dcAmt?: number;
        taxTyCd: string;
        taxAmt: number;
    }[];
}

// This is the expected data in a successful response from our simulated service
export interface EtimsValidationData {
  etimsInvoiceNumber: string;
  verificationCode: string;
  qrCodeData: string;
}

// The generic API response structure, based on the handleKraError function in PHP
interface KraApiResponse<T> {
    resultCd: string; // '0000' for success
    resultMsg: string;
    data?: T;
}


/**
 * This class simulates the behavior of the PHP ApiService.
 * It handles authentication, token management, and making requests
 * to a mock KRA ETIMS API endpoint.
 */
class EtimsApiService {
    private token: string | null = null;
    private tokenExpiry: number | null = null;

    // Hardcoded values based on the provided PHP code and context
    private readonly tin: string = 'P000123456X';
    private readonly bhfId: string = 'BHF01'; // Branch ID

    private isTokenValid(): boolean {
        // FIX: Use dot operator for property access in TypeScript
        if (!this.token || !this.tokenExpiry) return false;
        // Mimic the 5-minute buffer from the PHP isTokenValid method
        return Date.now() < (this.tokenExpiry - 300 * 1000);
    }

    private async authenticate(): Promise<void> {
        console.log('Authenticating with mock KRA ETIMS API...');
        // Simulate network delay for authentication
        await new Promise(resolve => setTimeout(resolve, 500));

        this.token = `mock_access_token_${Date.now()}`;
        // The PHP code uses 'expires_in' (seconds), so we simulate a 1-hour token
        this.tokenExpiry = Date.now() + 3600 * 1000;
        console.log('Authentication successful. Token expires at:', new Date(this.tokenExpiry));
    }

    private async request<T>(endpoint: string, payload: any): Promise<KraApiResponse<T>> {
        if (!this.isTokenValid()) {
            await this.authenticate();
        }

        console.log(`Making mock POST request to ${endpoint}`);
        console.log('Payload:', payload);

        // Simulate network delay for the main request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate a potential API error, like in the PHP code
        if (Math.random() < 0.1) { // 10% chance of failure
            console.error(`Simulated API error for ${endpoint}.`);
            return {
                resultCd: '9999',
                resultMsg: 'Could not connect to the ETIMS server. Please check your connection and try again.'
            };
        }
        
        // Simulate a successful response
        const etimsInvoiceNumber = `ETIMS-${payload.invcNo.slice(-6)}-${Date.now().toString().slice(-4)}`;
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const qrCodeData = `https://etims.kra.go.ke/verify?inv=${etimsInvoiceNumber}&code=${verificationCode}`;

        return {
            resultCd: '0000',
            resultMsg: 'Success',
            data: { etimsInvoiceNumber, verificationCode, qrCodeData } as T
        };
    }

    /**
     * Simulates the 'sendSalesTrns' method from SalesService.php
     */
    public async sendSalesTransaction(ticket: Ticket): Promise<EtimsValidationData> {
        const payload: SalesTransactionPayload = {
            tin: this.tin,
            bhfId: this.bhfId,
            invcNo: ticket.id,
            salesTrnsItems: ticket.items.map(item => {
                const supplyAmount = item.menuItem.price * item.quantity;
                const taxAmount = supplyAmount * 0.16; // Based on the app's 16% tax rate
                return {
                    itemCd: item.menuItem.id,
                    itemNm: item.menuItem.name,
                    qty: item.quantity,
                    prc: item.menuItem.price,
                    splyAmt: supplyAmount,
                    taxTyCd: 'A', // Assuming 'A' is the code for 16% VAT
                    taxAmt: taxAmount,
                }
            }),
        };

        const response = await this.request<EtimsValidationData>('/etims-oscu/v1/sendSalesTrns', payload);
        
        // This mimics the handleKraError function from the PHP helpers
        if (response.resultCd !== '0000' || !response.data) {
            console.error('ETIMS API Error:', response);
            throw new EtimsApiException(response.resultMsg, response.resultCd, response);
        }

        console.log('Sale registered successfully with ETIMS:', response.data);
        return response.data;
    }
}

// Export a singleton instance to be used across the app, similar to how services are instantiated in the PHP code.
export const etimsService = new EtimsApiService();
