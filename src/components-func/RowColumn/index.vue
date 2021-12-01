<script>
import style from './rowColumn.module.css';

export default {
  name: 'RowColumn',
  functional: true,
  props: {
    key: [Number, String],
  },
  render(h, { props, data, scopedSlots }) {
    const { key } = props;

    return (
      <td
        key={key}
        class={[style.column, data.class]}
      >
        {scopedSlots.default?.()}
      </td>
    );
  },
};
</script>