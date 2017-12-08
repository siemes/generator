import $ from 'jquery';
import nestedTree from './scripts/custom/nestedTree';
import s3upload from './scripts/custom/s3upload';
import cmsEditor from './scripts/custom/cmsEditor';
import cmsMediaSelect from './scripts/custom/cmsMediaSelect';
import cmsPageFilter from './scripts/custom/cmsPageFilter';
import cmsSortable from './scripts/custom/cmsSortable';
import config from './config';

$(() => {
  nestedTree();
  s3upload(config());
  cmsEditor();
  cmsMediaSelect();
  cmsPageFilter();
  cmsSortable();
});
