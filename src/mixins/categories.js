export const categories = {
    data: function() {
        return {
            categories: [],
            categoriesCount: {},
        }
    },
    methods: {
        getCategoryName: function (name) {
            let count = this.categoriesCount[name];
            if (count > 1) {
                name += ' (' + count + ')';
            }
            return name;
        },
        getCategories: function () {
            return this.categories;
        },
        setCategories: function (items, domain) {
            this.categories = [];
            this.categoriesCount = {};
            for (let i = 0; i < items.length; i++)
            {
                let item = items[i];
                if (domain !== '-1' && domain !== item.domains_name) {
                    continue;
                }
                let category = item.category;
                if (category && !this.categories.includes(category)) {
                    this.categories.push(category);
                    this.categoriesCount[category] = 1;
                } else {
                    this.categoriesCount[category]++;
                }
            }
            this.categories.sort((a, b) => a.localeCompare(b))
        },
    }
};