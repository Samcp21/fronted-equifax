import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import es from 'vee-validate/dist/locale/es';

Vue.use(VeeValidate, {
  inject: false,
  events: 'change',
});

Validator.localize('es', es);
