<template>
  <div :class="$style['posts-table']">
    <div :class="$style.options">
      <div :class="$style['options-block']">
        <div :class="$style['options-title']">Table type:</div>

        <button
          :class="[$style.btn, {[$style.active]: !isVirtualScroll}]"
          @click="onChangeTableComponent('MyTable')"
        >
          Common table
        </button>

        <button
          :class="[$style.btn, {[$style.active]: isVirtualScroll}]"
          @click="onChangeTableComponent('MyTableVS')"
        >
          Virtual scroll
        </button>
      </div>

      <div v-if="!isVirtualScroll" :class="$style['options-block']">
        <div :class="$style['options-title']">Loading type:</div>

        <button
          :class="[$style.btn, {[$style.active]: loadingMethod === loadingMethods.pagination}]"
          @click="onChangeLoadingMethod(loadingMethods.pagination)"
        >
          Pagination
        </button>

        <button
          :class="[$style.btn, {[$style.active]: loadingMethod === loadingMethods.scroll}]"
          @click="onChangeLoadingMethod(loadingMethods.scroll)"
        >
          Infinite scroll
        </button>
      </div>

      <div :class="$style['options-block']">
        <div :class="$style['options-title']">Limit:</div>
        <button :class="[$style.btn, {[$style.active]: limit === 5}]" @click="onChangeLimit(5)">5</button>
        <button :class="[$style.btn, {[$style.active]: limit === 10}]" @click="onChangeLimit(10)">10</button>
        <button :class="[$style.btn, {[$style.active]: limit === 15}]" @click="onChangeLimit(15)">15</button>
      </div>

      <div :class="$style['options-block']">
        <button
          :class="[$style.btn, $style['btn-reset']]"
          @click="onResetFiltersAndSort"
        >
          Reset filters, sort, limit
        </button>
      </div>
    </div>

    <Pagination
      v-if="isShowPagination"
      :class="$style.pagination"
      :page="currentPage"
      :totalPage="totalPage"
      @change="onPageChange" />

    <component :is="tableComponent" :items="preparedPosts" :columns="columns" :loading="isPending">
      <template #headerItem="{ column, class: headerItemClass }">
        <div :class="[$style['header-item'], headerItemClass]">
          <div :class="$style['name-wrapper']">
            <span
              :class="$style['name']"
              @click="onSortClick(column.id)"
            >
              {{column.name}}
            </span>

            <Icon
              :class="$style.icon"
              :name="getSortIcon(column.id).name"
              :color="getSortIcon(column.id).color"
              @click="onSortClick(column.id)" />
          </div>

          <div :class="$style['actions']">
            <FilterDropdown
              :value="columnFilters[column.id]"
              @change="onColumnFilterChange(column.id, $event)"
              @reset="onResetFilterByColumn(column.id)" />
          </div>
        </div>
      </template>

      <template v-if="isShowInfiniteLoading" #after>
        <InfiniteLoading
          :identifier="infiniteId"
          @infinite="onInfiniteLoading"
        >
          <div slot="no-results" :class="$style['infinite-message']">
            {{noResultsMessage}}
          </div>

          <div slot="no-more" :class="$style['infinite-message']">
            {{noMoreMessage}}
          </div>

          <template #error="{ trigger }">
            <div :class="$style['infinite-message']">
              <div>Failed to load data</div>
              <button :class="$style.button" @click="trigger">Repeat</button>
            </div>
          </template>
        </InfiniteLoading>
      </template>

      <template v-if="loadingMethod === 'scroll'" #no-more>
        <div></div>
      </template>
    </component>

    <Pagination
      v-if="isShowPagination"
      :class="$style.pagination"
      :page="currentPage"
      :totalPage="totalPage"
      @change="onPageChange" />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import Pagination from './Pagination.vue';
import FilterDropdown from './FilterDropdown.vue';
import MyTable from './MyTable.vue';
import MyTableVS from './MyTableVS.vue';
import Icon from './Icon.vue';
import { errorHandler } from '../error';
import api from '../utils/api';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import truncate from '../utils/truncate';
import colors from '../constants/colors';
import {
  TABLE_LOADING_METHOD,
  TABLE_SORT_TYPE,
  TABLE_DEFAULT_DATA
} from '../constants';

export default {
  name: 'PostsTable',
  components: {
    Pagination,
    MyTable,
    MyTableVS,
    Icon,
    FilterDropdown,
    InfiniteLoading,
  },
  data() {
    return {
      ...this.getDefaultData(),
      columns: [
        { id: 'id', name: 'ID', class: this.$style['column-id'] },
        { id: 'name', name: 'Name', class: this.$style['column-name'] },
        { id: 'email', name: 'E-mail', class: this.$style['column-email'] },
        { id: 'body', name: 'Message', class: this.$style['column-body'] },
      ],
      loadingMethods: TABLE_LOADING_METHOD,
      posts: [],
      currentPage: 1,
      totalPage: null,
      isPending: false,
      loadingMethod: TABLE_LOADING_METHOD.pagination,
      tableComponent: 'MyTable',
      debouncedLoadPosts: () => {},
      infiniteId: Date.now(),
    };
  },
  computed: {
    sortIds() {
      return Object.values(TABLE_SORT_TYPE).map((item) => item.id);
    },
    isShowInfiniteLoading() {
      return this.isVirtualScroll || !this.isVirtualScroll && this.loadingMethod === 'scroll';
    },
    isShowPagination() {
      return !this.isVirtualScroll && this.loadingMethod === TABLE_LOADING_METHOD.pagination;
    },
    noResultsMessage() {
      return this.posts?.length ? this.noMoreMessage : 'No results :(';
    },
    noMoreMessage() {
      return 'No more data :)';
    },
    isVirtualScroll() {
      return this.tableComponent === 'MyTableVS';
    },

    preparedPosts() {
      return this.posts.map((post) => ({...post, body: truncate(post.body, 100, true)}));
    }
  },
  created() {
    this.debouncedLoadPosts = debounce(this.loadPosts, 300);
  },
  mounted() {
    if (this.isVirtualScroll) {
      this.updateInfinite();
    } else {
      this.debouncedLoadPosts(1, true);
    }
  },
  methods: {
    getSortIcon(columnId) {
      const currentColumnSort = this.columnsSort[columnId];

      return {
        name: currentColumnSort ? TABLE_SORT_TYPE[currentColumnSort.type]?.icon || 'sort' : 'sort',
        color: currentColumnSort ? colors.primary : undefined
      };
    },
    async loadPosts(page = 1, isForce = false, $infiniteState = false) {
      const filters = {
        page: page < 1 ? 1 : page,
        limit: this.limit,
      };

      if (Object.keys(this.columnsSort)?.length) {
        filters.sort = this.columnsSort;
      }

      if (this.columnFilters && Object.keys(this.columnFilters)?.length) {
        filters.columnFilters = this.columnFilters;
      }

      if (isEqual(this.lastFilters, filters) && !isForce) {
        return;
      }

      this.isPending = true;

      try {
        const response = await api.getPosts(filters);

        const { totalPage, currentPage } = (response?.pagination || {});

        this.totalPage = totalPage || 0;
        this.currentPage = currentPage || 1;
        this.lastFilters = filters;

        const posts = response?.data || [];

        if ($infiniteState) {
          this.posts.push(...posts);

          if (this.currentPage === this.totalPage || !posts?.length) {
            $infiniteState?.complete?.();
          } else {
            $infiniteState?.loaded?.();
          }
        } else {
          this.posts = posts;
        }
      } catch (err) {
        if ($infiniteState) {
          $infiniteState?.error?.();
        }

        errorHandler(err);
      } finally {
        this.isPending = false;
      }
    },
    getDefaultData() {
      return cloneDeep(TABLE_DEFAULT_DATA);
    },
    onPageChange(page) {
      if ((this.totalPage && this.currentPage > this.totalPage) || this.isPending) {
        return;
      }

      this.debouncedLoadPosts(page);
    },
    onSortClick(columnId) {
      if (this.isPending) {
        return;
      }

      let sort = {};
      let newSortIndex;

      const currentColumnSort = this.columnsSort[columnId];
      const curSortIndex = this.sortIds.findIndex((sortId) => sortId === currentColumnSort?.type);

      if (curSortIndex < 0) {
        newSortIndex = 0;
      } else if (curSortIndex < this.sortIds.length - 1) {
        newSortIndex = curSortIndex + 1;
      }

      if (newSortIndex !== undefined) {
        sort = { type: this.sortIds[newSortIndex] };
      }

      if (sort?.type) {
        this.columnsSort = { ...this.columnsSort, [columnId]: sort };
      } else {
        this.columnsSort = omit(this.columnsSort, columnId);
      }

      this.updateListData();
    },
    onColumnFilterChange(columnId, filter) {
      if (filter?.length) {
        this.columnFilters =  {
          ...this.columnFilters,
          [columnId]: filter,
        };
      } else {
        this.columnFilters = omit(this.columnFilters, columnId);
      }

      this.updateListData();
    },
    reset(needLoad = true) {
      Object.entries(this.getDefaultData()).forEach(([key, value]) => {
        this[key] = value;
      });

      if (!needLoad) {
        return;
      }

      this.debouncedLoadPosts();
    },
    onResetFiltersAndSort() {
      if (this.isPending) {
        return;
      }

      if (this.loadingMethod === 'scroll') {
        this.reset(false);
        this.updateInfinite();
      } else {
        this.reset();
      }
    },
    onResetFilterByColumn(columnId) {
      if (this.isPending) {
        return;
      }

      this.columnFilters = omit(this.columnFilters, columnId);

      this.updateListData();
    },
    updateListData() {
      if (this.loadingMethod === 'scroll') {
        this.updateInfinite();
      } else {
        this.debouncedLoadPosts();
      }
    },
    updateInfinite() {
      this.currentPage = 0;
      this.totalPage = null;
      this.posts = [];
      this.infiniteId++;
    },
    onChangeLimit(limit) {
      if (this.limit === limit || this.isPending) {
        return;
      }

      this.limit = limit || 5;

      this.updateListData();
    },
    onChangeLoadingMethod(method) {
      if (this.loadingMethod === method || this.isPending) {
        return;
      }

      if (method === 'scroll') {
        this.reset(false);
        this.updateInfinite();

        this.loadingMethod = method;
        return;
      }

      this.loadingMethod = method;
      this.reset();
    },
    onInfiniteLoading($state) {
      const nextPage = this.currentPage + 1;

      if (this.totalPage === null || nextPage <= this.totalPage) {
        this.debouncedLoadPosts(nextPage, false, $state);
      }
    },
    onChangeTableComponent(componentName) {
      if (this.tableComponent === componentName || this.isPending) {
        return;
      }

      if (componentName === 'MyTableVS') {
        this.reset(false);
        this.updateInfinite();
        this.loadingMethod = 'scroll';
      } else {
        this.loadingMethod = TABLE_LOADING_METHOD.pagination;
        this.reset();
      }

      this.tableComponent = componentName;
    }
  }
};
</script>

<style module>
.posts-table {
  max-height: 100vw;
}
.options {
  display: flex;
  margin-bottom: 20px;
}
.options-title {
  margin-bottom: 5px;
  font-weight: bold;
}
.options-block {
  margin-right: 20px;
}
.options-block .btn:last-child {
  margin-right: 0;
}
.options-block:last-child {
  flex: 1 0 50px;
  margin-right: 0;
  display: flex;
  justify-content: flex-end;
}
.options-block:last-child .btn {
  min-height: 50px;
}
.header-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  padding: 5px 15px;
}
.name-wrapper {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.btn {
  margin-right: 5px;
}
.btn.active {
  background-color: var(--primary);
  color: var(--white);
}
.actions {
  display: flex;
  align-items: center;
  margin-left: 15px;
}
.header-item .icon {
  margin-left: 5px;
  cursor: pointer;
}
.header-item .name {
  cursor: pointer;
}
.column-id {
  width: 15%;
}
.column-name, .column-email {
  width: 20%;
}
.column-body {
  width: 45%;
}
.infinite-message {
  padding: 15px;
}
.infinite-message .button {
  margin-top: 10px;
}
.btn-reset {
  font-weight: bold;
}
</style>
