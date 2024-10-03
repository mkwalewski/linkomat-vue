<template>
  <div class="">
    <h1>Yotube Videos ({{ filteredItems.length }})</h1>
    <div class="row">
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
        <label>Obejrzane</label>
        <select class="form-control" v-model="filterByWatch">
          <option value="-1">Wszystkie</option>
          <option value="1">TAK</option>
          <option value="0">NIE</option>
        </select>
      </div>
      <div class="col-1">
        <label>Sortowanie</label>
        <select v-model="orderBy" class="form-control">
          <option value="title">Tytuł</option>
          <option value="date">Data video</option>
          <option value="add_date">Data dodania video</option>
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
            :img-src="item.thumb"
            img-height="200"
            tag="article"
            body-class="px-4 py-1"
            class="m-0"
        >
          <template #header>
            <h6 class="mb-0 text-trun1cate">
              <a :href="item.url" target="_blank">{{ item.title }}</a>
            </h6>
          </template>
          <b-card-text>
            <div class="row mb-1">
              <div class="col-3 small text-left p-0">
                <a href="#" v-b-modal="'video-' + item.id">
                  <b-icon icon="stopwatch" aria-hidden="true"></b-icon> {{ item.length_formatted }}
                </a>
              </div>
              <div class="col-9 small text-left p-0">
                <a :href="item.channel_url" target="_blank">
                  <b-icon icon="person" aria-hidden="true"></b-icon> {{ item.author }}
                </a>
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-4 small text-left p-0">
                <b-icon icon="calendar-date" aria-hidden="true"></b-icon> {{ item.date }}
              </div>
              <div class="col-8 small text-left p-0">
                <b-icon icon="search" aria-hidden="true"></b-icon> {{ item.category }}
              </div>
            </div>
          </b-card-text>
          <b-modal :id="'video-' + item.id" size="xl" :title="item.title" ok-only>
            <div class="row mb-1">
              <div class="col-1 small text-left p-0">
                <b-icon icon="calendar-date-fill" aria-hidden="true"></b-icon> {{ item.date }}
              </div>
              <div class="col-1 small text-left p-0">
                <b-icon icon="stopwatch-fill" aria-hidden="true"></b-icon> {{ item.length_formatted }}
              </div>
              <div class="col-3 small text-left p-0">
                <b-icon icon="person-fill" aria-hidden="true"></b-icon> {{ item.author }}
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-1 small text-left p-0">
                <b-icon icon="plus-circle-fill" aria-hidden="true"></b-icon> {{ item.created_at }}
              </div>
              <div class="col-1 small text-left p-0">
                <b-icon icon="eye-fill" aria-hidden="true"></b-icon> {{ item.view_count_formatted }}
              </div>
              <div class="col-3 small text-left p-0">
                <b-icon icon="search" aria-hidden="true"></b-icon> {{ item.category }}
              </div>
            </div>
            <div class="row mb-1">
              <span v-for="(key,k) in getKeywords(item)" :key="k" class="badge badge-pill badge-success" style="margin-right: 5px;">
                {{ key }}
              </span>
            </div>
            <hr/>
            <iframe width="1100" height="620" :src="getVideoUrl(item)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <div class="row m-3">
              <article v-html="item.short_description" class="video-content"></article>
            </div>
            <template #modal-footer="{ ok }">
              <b-button variant="danger" class="mr-auto" @click="markAsWatch(item)">Obejrzane</b-button>
              <b-button variant="success" @click="ok()">OK</b-button>
            </template>
          </b-modal>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import {authors} from "@/mixins/authors";
import {categories} from "@/mixins/categories";

export default {
  name: "YoutubeVideosList",
  mixins: [authors, categories],
  data: function () {
    return {
      items: [],
      filteredItems: [],
      // filterByDomain: '-1',
      filterByAuthor: '-1',
      filterByCategory: '-1',
      filterByWatch: '0',
      // filterByPremium: '0',
      orderBy: 'date',
      orderByType: 'desc',
    }
  },
  created: function () {
    this.fetchData();
  },
  watch: {
    // filterByDomain: function () {
    //   this.searchItems();
    // },
    filterByAuthor: function () {
      this.searchItems();
    },
    filterByCategory: function () {
      this.searchItems();
    },
    filterByWatch: function () {
      this.searchItems();
    },
    // filterByPremium: function () {
    //   this.searchItems();
    // },
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
        const response = await fetch(process.env.VUE_APP_BACKEND_URL + '/api/videos/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.VUE_APP_AUTH_TOKEN,
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.items = await response.json();
        this.searchItems();
        this.setAuthors(this.items, '-1');
        this.setCategories(this.items, '-1');
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

      // if (self.filterByDomain !== '-1') {
      //   results = results.filter(function (item) {
      //     return item.domains_name.indexOf(self.filterByDomain) !== -1;
      //   });
      // }

      if (self.filterByWatch !== '-1') {
        results = results.filter(function (item) {
          if (self.filterByWatch === '1') {
            return item.is_watch;
          }
          if (self.filterByWatch === '0') {
            return !item.is_watch;
          }
        });
      }

      this.filteredItems = results;
    },
    markAsWatch: function (item) {
      this.$bvModal.msgBoxConfirm('Czy na pewno oznaczyc jako obejrzane?', {
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
                const response = await fetch(process.env.VUE_APP_BACKEND_URL + '/api/videos/mark_as_watch', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.VUE_APP_AUTH_TOKEN,
                  },
                  body: JSON.stringify({id: item.id})
                });
                const status = await response.status;
                if (status === 200) {
                  item.is_watch = true;
                  this.searchItems();
                  this.$bvModal.hide('video-' + item.id);
                }
              } catch (error) {
                console.log(error.message);
              }
            }
          });
    },
    getKeywords: function (item) {
      if (item.keywords) {
        return item.keywords.split(',');
      }
      return [];
    },
    getVideoUrl: function (item) {
      return 'https://www.youtube-nocookie.com/embed/' + item.video_id;
    },
  },
}
</script>

<style>

</style>