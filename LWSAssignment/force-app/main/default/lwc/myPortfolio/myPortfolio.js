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

    // Parse projects from structured format
    get projectsList() {
        if (!this.portfolio || !this.portfolio.Portfolio_Projects__c) return null;
        try {
            const projects = [];
            const projectBlocks = this.portfolio.Portfolio_Projects__c.split('\n\n');
            
            projectBlocks.forEach((block, index) => {
                const lines = block.split('\n').filter(l => l.trim());
                if (lines.length >= 2) {
                    projects.push({
                        id: index,
                        title: lines[0],
                        tech: lines[1],
                        description: lines.slice(2).join(' ')
                    });
                }
            });
            
            return projects.length > 0 ? projects : null;
        } catch (error) {
            return null;
        }
    }

    // Parse certifications (line-separated)
    get certificationsList() {
        if (!this.portfolio || !this.portfolio.Portfolio_Certifications__c) return null;
        return this.portfolio.Portfolio_Certifications__c
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    get noData() {
        return !this.isLoading && !this.portfolio && !this.error;
    }
}
