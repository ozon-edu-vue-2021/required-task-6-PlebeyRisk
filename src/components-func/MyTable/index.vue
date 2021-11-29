<script lang="jsx">
import defaultTypes from '../../constants/defaultTypes';
import HeaderItem from '../HeaderItem';
import RowColumn from '../RowColumn';
import Row from '../Row';
import style from './myTable.module.css';

export default {
  name: 'MyTable',
  functional: true,
  props: {
    items: defaultTypes.array(),
    columns: defaultTypes.array(),
    loading: defaultTypes.boolean(),
  },
  render(h, { props, scopedSlots }) {
    const { loading, items, columns } = props;

    const bodyItems = items.map((row) => {
      const rowColumns = Object.entries(row).map(([colKey, col], index) => (
        <RowColumn
          class={columns[index].class}
          key={colKey}
        >
          {col}
        </RowColumn>
      ));

      return (
        <Row key={row.id}>
          {...rowColumns}
        </Row>
      );
    });

    const headerItems = columns.map((column) => {
      return (
        <HeaderItem data={column}>
          {scopedSlots.headerItem?.({ column, class: style['header-item'] })}
        </HeaderItem>
      );
    });


    const noMoreSlotDefaultComponent = (
      <div class={style['no-more-message']}>
        No results :(
      </div>
    );

    return (
      <div>
        <table class={style.table}>
          <thead class={style.header}>
            {...headerItems}
          </thead>

          <tbody class={style.body}>
            {...bodyItems}
          </tbody>
        </table>

        {!items?.length && !loading &&
          (scopedSlots['no-more'] ? scopedSlots['no-more']() : noMoreSlotDefaultComponent)
        }

        {scopedSlots.after?.()}
      </div>
    );
  }
};
</script>
