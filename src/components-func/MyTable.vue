<script lang="jsx">
import defaultTypes from '../constants/defaultTypes';

export default {
  name: 'MyTable',
  props: {
    items: defaultTypes.array(),
    columns: defaultTypes.array(),
    loading: defaultTypes.boolean(),
  },
  computed: {
    haveItems() {
      return !!this.items?.length;
    },
  },
  methods: {
    renderRowColumns(row = {}) {
      return Object.entries(row).map(([colKey, col], index) => (
        <td
          key={colKey}
          class={[this.$style.column, this.columns[index].class]}
        >
          {col}
        </td>
      ));
    },
    renderBodyItems() {
      return this.items.map((row) => {
        const rowColumns = this.renderRowColumns(row);

        return (
          <tr key={row.id} class={this.$style.row}>
            {...rowColumns}
          </tr>
        );
      });
    },
    renderHeaderItems() {
      return this.columns.map((column) => {
        const headerItemSlot = this.$scopedSlots.headerItem
          && this.$scopedSlots.headerItem({ column, class: this.$style['header-item'] });

        return (
          <th key={column.id} class={column.class}>
            {headerItemSlot}
          </th>
        );
      });
    }
  },
  render() {
    const { $style, haveItems, $scopedSlots, loading } = this;

    const bodyItems = this.renderBodyItems();

    const headerItems = this.renderHeaderItems();

    const noMoreSlotDefaultComponent = (
      <div class={$style['no-more-message']}>
        No results :(
      </div>
    );

    return (
      <div>
        <table class={$style.table}>
          <thead class={$style.header}>
            {...headerItems}
          </thead>

          <tbody class={$style.body}>
            {...bodyItems}
          </tbody>
        </table>

        {!haveItems && !loading &&
          ($scopedSlots['no-more'] ? $scopedSlots['no-more']() : noMoreSlotDefaultComponent)
        }

        {$scopedSlots.after?.()}
      </div>
    );
  }
};
</script>

<style module>
.table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.header-item {
  background: var(--gray);
  overflow: hidden;
}
.column {
  text-align: left;
  border-bottom: 1px solid var(--gray);
  padding: 1rem 1rem;
  overflow: hidden;
  max-height: 100px;
  height: 100px;
}
.no-more-message {
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 15px;
}
</style>
