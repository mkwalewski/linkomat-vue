export const domains = {
    data: function() {
        return {
            domains: [],
            domainsCount: {},
        }
    },
    methods: {
        getDomainName: function (name) {
            let count = this.domainsCount[name];
            if (count > 1) {
                name += ' (' + count + ')';
            }
            return name;
        },
        getDomains: function () {
            return this.domains;
        },
        setDomains: function (items) {
            for (let i = 0; i < items.length; i++)
            {
                let item = items[i];
                let domain = item.domains_name;
                if (domain && !this.domains.includes(domain)) {
                    this.domains.push(domain);
                    this.domainsCount[domain] = 1;
                } else {
                    this.domainsCount[domain]++;
                }
            }
            this.domains.sort((a, b) => a.localeCompare(b))
        },
    }
};