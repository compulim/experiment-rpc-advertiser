import './customElement/dataProvider';
import './customElement/toDoList';

IS_DEVELOPMENT && new EventSource('/esbuild').addEventListener('change', () => location.reload());
