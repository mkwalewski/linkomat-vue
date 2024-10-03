<template>
  <div class="">
    <h1>Artykuły ({{ filteredItems.length }})</h1>
    <div class="row">
      <div class="col-2">
        <label>Domena</label>
        <select class="form-control" v-model="filterByDomain">
          <option value="-1">Wszystkie</option>
          <option :value="domain" v-for="(domain,d) in getDomains()" :key="d">{{ getDomainName(domain, true) }}</option>
        </select>
      </div>
      <div class="col-2">
        <label>Kategoria</label>
        <select class="form-control" v-model="filterByCategory">
          <option value="-1">Wszystkie</option>
          <option :value="category" v-for="(category,c) in getCategories()" :key="c">{{ getCategoryName(category, true) }}</option>
        </select>
      </div>
      <div class="col-2">
        <label>Autor</label>
        <select class="form-control" v-model="filterByAuthor">
          <option value="-1">Wszystkie</option>
          <option :value="author" v-for="(author,a) in getAuthors()" :key="a">{{ getAuthorName(author, true) }}</option>
        </select>
      </div>
      <div class="col-2">
        <label>Przeczytane</label>
        <select class="form-control" v-model="filterByRead">
          <option value="-1">Wszystkie</option>
          <option value="1">TAK</option>
          <option value="0">NIE</option>
        </select>
      </div>
      <div class="col-2">
        <label>Premium</label>
        <select class="form-control" v-model="filterByPremium">
          <option value="-1">Wszystkie</option>
          <option value="1">TAK</option>
          <option value="0">NIE</option>
        </select>
      </div>
      <div class="col-1">
        <label>Sortowanie</label>
        <select v-model="orderBy" class="form-control">
          <option value="title">Tytuł</option>
          <option value="date">Data artykułu</option>
          <option value="add_date">Data dodania artykułu</option>
        </select>
      </div>
      <div class="col-1">
        <label>Typ sortowania</label>
        <select v-model="orderByType" class="form-control">
          <option value="asc">Rosnąco</option>
          <option value="desc">Malejąco</option>
        </select>
      </div>
    </div>
    <br/>
    <div class="row">
      <div class="col-2 p-1" v-for="(item,i) in filteredItems" :key="i" style="text-align: center">
        <b-card
            header-tag="header"
            header-class="p-1"
            :img-src="item.image"
            img-height="200"
            tag="article"
            body-class="px-4 py-1"
            class="m-0"
        >
          <template #header>
            <h6 class="mb-0 text-trun1cate">
              <img :src="item.domains_icon" width="16px" />
              &nbsp;
              <a :href="item.url" target="_blank">{{ item.title }}</a>
              <template v-if="item.is_premium">
                &nbsp;<b-icon icon="star-fill" variant="danger"></b-icon>
              </template>
            </h6>
          </template>
          <b-card-text>
            <div class="row mb-1">
              <div class="col-4 small text-left p-0">
                <a href="#" v-b-modal="'article-' + item.id">
                  <b-icon icon="book" aria-hidden="true"></b-icon> {{ item.read_time }}
                </a>
              </div>
              <div class="col-8 small text-left p-0">
                <b-icon icon="search" aria-hidden="true"></b-icon> {{ item.category }}
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-4 small text-left p-0">
                <b-icon icon="calendar-date" aria-hidden="true"></b-icon> {{ item.date }}
              </div>
              <div class="col-4 small text-left p-0">
                <b-icon icon="plus-circle" aria-hidden="true"></b-icon> {{ item.created_at }}
              </div>
            </div>
          </b-card-text>
          <b-modal :id="'article-' + item.id" size="xl" :title="item.title" ok-only>
            <div class="row mb-1">
              <div class="col-1 small text-left p-0">
                <b-icon icon="calendar-date-fill" aria-hidden="true"></b-icon> {{ item.date }}
              </div>
              <div class="col-1 small text-left p-0">
                <b-icon icon="book-fill" aria-hidden="true"></b-icon> {{ item.read_time }}
              </div>
              <div class="col-3 small text-left p-0">
                <b-icon icon="search" aria-hidden="true"></b-icon> {{ item.category }}
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-1 small text-left p-0">
                <b-icon icon="plus-circle-fill" aria-hidden="true"></b-icon> {{ item.created_at }}
              </div>
              <div class="col-1 small text-left p-0">
                <b-icon icon="file-earmark-word-fill" aria-hidden="true"></b-icon> {{ item.words_count }} słów
              </div>
              <div class="col-3 small text-left p-0">
                <b-icon icon="person-fill" aria-hidden="true"></b-icon> {{ item.author }}
              </div>
            </div>
            <div class="row mb-1">
              <span v-for="(tag,t) in getTags(item)" :key="t" class="badge badge-pill badge-success" style="margin-right: 5px;">
                {{ tag }}
              </span>
            </div>
            <hr/>
            <div class="row m-3">
              <article v-html="item.content" class="article-content"></article>
            </div>
            <template #modal-footer="{ ok }">
              <b-button variant="danger" class="mr-auto" @click="markAsRead(item)">Przeczytane</b-button>
              <b-button variant="success" @click="ok()">OK</b-button>
            </template>
          </b-modal>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import {categories} from "@/mixins/categories";
import {domains} from "@/mixins/domains";
import {authors} from "@/mixins/authors";

export default {
  name: "ArticlesList",
  mixins: [authors, categories, domains],
  data: function () {
    return {
      items: [],
      filteredItems: [],
      filterByDomain: '-1',
      filterByAuthor: '-1',
      filterByCategory: '-1',
      filterByRead: '0',
      filterByPremium: '0',
      orderBy: 'date',
      orderByType: 'desc',
    }
  },
  created: function () {
    this.fetchData();
  },
  watch: {
    filterByDomain: function () {
      this.searchItems();
      this.setAuthors(this.items, this.filterByDomain);
      this.setCategories(this.items, this.filterByDomain);
    },
    filterByAuthor: function () {
      this.searchItems();
    },
    filterByCategory: function () {
      this.searchItems();
    },
    filterByRead: function () {
      this.searchItems();
    },
    filterByPremium: function () {
      this.searchItems();
    },
    orderBy: function () {
      this.searchItems();
    },
    orderByType: function () {
      this.searchItems();
    },
  },
  methods: {
    fetchData: async function () {
      try {
        const response = await fetch('http://linkomat.local/api/articles/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.items = await response.json();
        this.searchItems();
        this.setDomains(this.filteredItems);
        this.setAuthors(this.items, this.filterByDomain);
        this.setCategories(this.items, this.filterByDomain);
      } catch (error) {
        console.log(error.message);
      }
    },
    searchItems: function () {
      let self = this;
      let results = self.items;

      results = results.sort(function (a, b) {
        switch (self.orderBy) {
          case 'title':
            return (self.orderByType === 'asc') ? (a.title).localeCompare(b.title) : (b.title).localeCompare(a.title);
          case 'date':
            return (self.orderByType === 'asc') ? parseInt(a.date_timestamp) - parseInt(b.date_timestamp) : parseInt(b.date_timestamp) - parseInt(a.date_timestamp);
          case 'add_date':
            return (self.orderByType === 'asc') ? parseInt(a.created_at_timestamp) - parseInt(b.created_at_timestamp) : parseInt(b.created_at_timestamp) - parseInt(a.created_at_timestamp);
        }
      });

      if (self.filterByDomain !== '-1') {
        results = results.filter(function (item) {
          return item.domains_name.indexOf(self.filterByDomain) !== -1;
        });
      }

      if (self.filterByAuthor !== '-1') {
        results = results.filter(function (item) {
          return item.author.indexOf(self.filterByAuthor) !== -1;
        });
      }

      if (self.filterByCategory !== '-1') {
        results = results.filter(function (item) {
          return item.category.indexOf(self.filterByCategory) !== -1;
        });
      }

      if (self.filterByRead !== '-1') {
        results = results.filter(function (item) {
          if (self.filterByRead === '1') {
            return item.is_read;
          }
          if (self.filterByRead === '0') {
            return !item.is_read;
          }
        });
      }

      if (self.filterByPremium !== '-1') {
        results = results.filter(function (item) {
          if (self.filterByPremium === '1') {
            return item.is_premium;
          }
          if (self.filterByPremium === '0') {
            return !item.is_premium;
          }
        });
      }

      this.filteredItems = results;
    },
    markAsRead: function (item) {
      this.$bvModal.msgBoxConfirm('Czy na pewno oznaczyc jako przeczytane?', {
        title: 'Potwierdz',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'TAK',
        cancelTitle: 'NIE',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
          .then(async value => {
            if (value) {
              try {
                const response = await fetch('http://linkomat.local/api/articles/mark_as_read', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({id: item.id})
                });
                const status = await response.status;
                if (status === 200) {
                  item.is_read = true;
                  this.searchItems();
                  this.$bvModal.hide('article-' + item.id);
                }
              } catch (error) {
                console.log(error.message);
              }
            }
          });
    },
    getTags: function (item) {
      if (item.tags) {
        return item.tags.split(',');
      }
      return [];
    },
  },
}
</script>

<style>
.article-content img {
  max-width: 100% !important;
}
</style>