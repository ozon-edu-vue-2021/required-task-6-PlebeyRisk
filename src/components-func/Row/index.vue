<script>
export default {
  name: 'Row',
  functional: true,
  props: {
    key: [Number, String],
  },
  render(h, { children, props }) {
    return (
      <tr key={props.key}>
        {...children}
      </tr>
    );
  },
};
</script>