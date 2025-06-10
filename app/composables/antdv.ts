
import zh_CN from 'ant-design-vue/es/locale/zh_CN';
import zh_TW from 'ant-design-vue/es/locale/zh_TW';
import en_US from 'ant-design-vue/es/locale/en_US';
import vi_VN from 'ant-design-vue/es/locale/vi_VN';
import id_ID from 'ant-design-vue/es/locale/id_ID';
import ms_MY from 'ant-design-vue/es/locale/ms_MY';

import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/vi';
import 'dayjs/locale/id';
import 'dayjs/locale/ms-my';

let antLocales:Record<string,any> = {
    zh_CN,
    zh_TW,
    en_US,
    vi_VN,
    id_ID,
    ms_MY,
}

export const useAntLocale = computed(()=>{
    let locale =  useNuxtApp().$i18n.locale
    dayjs.locale({
        'zh_CN':'zh-cn',
        'zh_TW':'zh-tw',
        'en_US':'en',
        'vi_VN':'vi',
        'id_ID':'id',
        'ms_MY':'ms-my'
    }[locale.value]);

    return antLocales[locale.value]
})