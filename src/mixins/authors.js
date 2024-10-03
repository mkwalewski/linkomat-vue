export const authors = {
    data: function() {
        return {
            authors: [],
            authorsCount: {},
        }
    },
    methods: {
        getAuthorName: function (name) {
            let count = this.authorsCount[name];
            if (count > 1) {
                name += ' (' + count + ')';
            }
            return name;
        },
        getAuthors: function () {
            return this.authors;
        },
        setAuthors: function (items, domain) {
            this.authors = [];
            this.authorsCount = {};
            for (let i = 0; i < items.length; i++)
            {
                let item = items[i];
                if (domain !== '-1' && domain !== item.domains_name) {
                    continue;
                }
                let author = item.author;
                if (author && !this.authors.includes(author)) {
                    this.authors.push(author);
                    this.authorsCount[author] = 1;
                } else {
                    this.authorsCount[author]++;
                }
            }
            this.authors.sort((a, b) => a.localeCompare(b))
        },
    }
};