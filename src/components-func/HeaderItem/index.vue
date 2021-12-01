<script lang="jsx">
import defaultTypes from '../../constants/defaultTypes';

export default {
  name: 'HeaderItem',
  functional: true,
  props: {
    data: defaultTypes.object(),
  },
  render(h, { props, scopedSlots }) {
    const { data } = props;
    return (
      <th key={data.id} class={data.class}>
        {scopedSlots.default?.()}
      </th>
    );
  }
};
</script>