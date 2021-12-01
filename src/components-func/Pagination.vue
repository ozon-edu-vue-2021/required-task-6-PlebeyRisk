<script>
export default {
  name: 'Pagination',
  props: {
    page: Number,
    totalPage: Number,
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    isShowFirstPageButton() {
      return this.currentPage > 1;
    },
    isShowLastPageButton() {
      return this.totalPage !== undefined && this.currentPage < this.totalPage;
    },
    prevPrevPage() {
      return this.getPrevPage(this.currentPage - 1);
    },
    previousPage() {
      return this.getPrevPage(this.currentPage);
    },
    nextPage() {
      return this.getNextPage(this.currentPage);
    },
    nextNextPage() {
      return this.getNextPage(this.currentPage + 1);
    },
  },
  watch: {
    page: {
      immediate: true,
      handler(val) {
        this.setCurrentPage(val, false);
      },
    },
  },
  methods: {
    getPrevPage(page) {
      return page <= 1 ? 0 : page - 1;
    },
    getNextPage(page) {
      return (this.totalPage && page >= this.totalPage) ? 0 : page + 1;
    },
    setCurrentPage(value, needEmit = true) {
      const newValue = (!value || (value && value < 1)) ? 1 : value;

      if (newValue === this.currentPage) {
        return;
      }

      if (needEmit) {
        this.$emit('change', newValue);
      } else {
        this.currentPage = newValue;
      }
    },
    onGoToPageButtonClick(page) {
      this.goToPage(page);
    },
    goToPage(page) {
      this.setCurrentPage(page);
    },
    onFirstPageClick() {
      this.goToPage(1);
    },
    onLastPageClick() {
      this.goToPage(this.totalPage);
    },
  },
  render() {
    const {
      $style,
      totalPage,
      isShowFirstPageButton,
      isShowLastPageButton,
      prevPrevPage,
      previousPage,
      currentPage,
      nextPage,
      nextNextPage,
    } = this;

    return totalPage > 0 ? (
      <div class={$style.pagination}>
        {isShowFirstPageButton &&
          <button
            class={$style.button}
            on={{ click: this.onFirstPageClick }}
          >
            {'<<'}
          </button>
        }

        {!!prevPrevPage &&
          <button
            class={$style.button}
            on={{ click: () => this.onGoToPageButtonClick(prevPrevPage)}}
          >
            {prevPrevPage}
          </button>
        }

        {!!previousPage &&
          <button
            class={$style.button}
            on={{ click: () => this.onGoToPageButtonClick(previousPage)}}
          >
            {previousPage}
          </button>
        }

        <span class={[$style.button, $style.current]}>
          {currentPage}
        </span>

        {!!nextPage &&
          <button
            class={$style.button}
            on={{ click: () => this.onGoToPageButtonClick(nextPage)}}
          >
            {nextPage}
          </button>
        }

        {!!nextNextPage &&
          <button
            class={$style.button}
            on={{ click: () => this.onGoToPageButtonClick(nextNextPage)}}
          >
            {nextNextPage}
          </button>
        }

        {isShowLastPageButton &&
          <button
            class={$style.button}
            on={{ click: this.onLastPageClick }}
          >
            {'>>'}
          </button>
        }
      </div>
    ) : undefined;
  }
};
</script>

<style module>
.pagination {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
  margin: 0;
  padding: 5px;
  background-color: transparent;
  border: none;
  font-weight: normal;
  display: flex;
  min-width: 25px;
  cursor: pointer;
  color: var(--primaryLighten);
}
.button.current {
  cursor: default;
  color: inherit;
}
</style>
