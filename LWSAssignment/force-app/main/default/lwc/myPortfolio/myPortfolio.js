import { LightningElement, wire, track } from 'lwc';
import getPortfolioData from '@salesforce/apex/PortfolioController.getPortfolioData';

export default class MyPortfolio extends LightningElement {
    @track portfolio;
    @track error;
    @track isLoading = true;

    @wire(getPortfolioData)
    wiredPortfolio({ data, error }) {
        this.isLoading = false;
        if (data) {
            this.portfolio = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.portfolio = undefined;
        }
    }

    get initials() {
        if (!this.portfolio || !this.portfolio.Name) return '?';
        const parts = this.portfolio.Name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    }

    // Splits comma-separated skills string into an array
    get skillsList() {
        if (!this.portfolio || !this.portfolio.Portfolio_Skills__c) return null;
        return this.portfolio.Portfolio_Skills__c
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    get noData() {
        return !this.isLoading && !this.portfolio && !this.error;
    }
}
