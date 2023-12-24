<script lang="ts" setup>
interface Props {
  plain?: boolean;
  modelValue?: string | number;
  type?: string;
  width?: string | number;
  height?: string | number;
  iconLeft?: string; // 大小为figma导出的3倍图
  iconRight?: string; // 大小为figma导出的3倍图
  clearable?: boolean;
  msg?: string;
  pattern?: RegExp;
  required?: boolean;
  styleObj?: any;
  align?: string;
  validWhen?: string;
  maxLength?: number;
  errHeight?: number | string;
  rules?: Array<RuleItem>;
  isConfirmPhone?: boolean;
  secondMsg?: string;
  confirmVal?: string;
}

type RuleItem = {
  required?: boolean;
  pattern?: RegExp;
  msg: string;
  validator?: Function;
  isConfirmPhone: false;
  secondMsg: "";
  confirmVal: "";
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  width: 580,
  height: 72,
  clearable: false,
  styleObj: {},
  align: "left",
  validWhen: "input",
  errHeight: 42,
});

const emits = defineEmits(["update:modelValue", "change"]);

// const { required, pattern } = useAttrs()

const isValid = ref(false);
const isShowError = ref(false);
const showClear = ref(true);

const outerRef = ref();
const innerref = ref();
const inputref = ref();

const _type = ref(props.type);
const isPwd = computed(() => props.type === "password");

const _msg = ref(props.msg || "");

const innerStyle = computed(() => {
  const obj: any = {
    width: +props.width > 0 ? `var(--app-px-${props.width})` : props.width,
    height: `var(--app-px-${props.height})`,
    ...props.styleObj,
  };
  if (props.plain) {
    obj.border = "0";
    obj.background = "transparent";
    obj.borderRadius = "0";
  }
  return obj;
});

const eventInput = (e: any) => {
  const newValue = e.target?.value;
  emits("update:modelValue", newValue);
  emits("change", newValue);
  // isShowError.value = false
  if (props.validWhen === "input") {
    validation(newValue);
  }
};

const eventFocus = (e: any) => {
  const arr = document.querySelectorAll(".app-input-outer.focused");
  arr.forEach((item) => {
    item.classList.remove("focused");
  });
  setTimeout(() => {
    outerRef.value.classList.add("focused");
  }, 0);
  showClear.value = true;
};

const eventBlur = () => {
  validation();
  setTimeout(() => {
    showClear.value = false;
  }, 100);
};

const eventClear = () => {
  emits("update:modelValue", "");
};

const validation = (newValue?: undefined | string | number) => {
  const vv = newValue === undefined ? props.modelValue : newValue;

  if (props.rules && props.rules.length) {
    for (let r = 0; r < props.rules.length; r++) {
      const item = props.rules[r];
      if (item.pattern) {
        isValid.value = (item.pattern as RegExp).test(vv + "");
      } else if (item.validator) {
        isValid.value = item.validator(vv);
      } else if (item.required && isVEmpty(vv)) {
        isValid.value = false;
      } else {
        isValid.value = true;
      }
      if (!isValid.value) {
        _msg.value = item.msg;
        break;
      }
    }
  } else if (props.pattern) {
    isValid.value = (props.pattern as RegExp).test(vv + "");
  } else if (props.required && isVEmpty(vv)) {
    isValid.value = false;
  } else if (props.isConfirmPhone) {
    isValid.value = vv === props.confirmVal;
  } else {
    isValid.value = true;
  }

  if (props.type === "email") {
    isValid.value = emailReg.test(vv.toString());
  }

  if (!isValid.value) {
    errorMsgStyle.value.paddingLeft = `${Math.ceil(
      inputref.value.getBoundingClientRect().left -
        innerref.value.getBoundingClientRect().left
    )}px`;
    isShowError.value = true;
  } else {
    isShowError.value = false;
  }

  return isValid.value;
};

const errorMsgStyle = ref<any>({
  paddingLeft: "0",
  lineHeight: "var(--app-px-" + props.errHeight + ")",
  bottom: "var(--app-npx-" + props.errHeight + ")",
  textAlign: props.align,
});
const imgLoaded = (e: any, ty: string) => {
  e.currentTarget.style.width = `var(--app-px-${Math.ceil(
    e.target.naturalWidth / 3
  )})`;
};

const togglePwd = () => {
  if (_type.value === "password") {
    _type.value = "text";
  } else {
    _type.value = "password";
  }
};

defineExpose({ validation, isValid });

watch(
  () => props.type,
  (val, old) => {
    if (val) {
      _type.value = val;
    }
  }
);
</script>

<template>
  <section ref="outerRef" class="app-input-outer">
    <div ref="innerref" class="inner" :style="innerStyle">
      <div v-if="iconLeft" class="icon-left">
        <AppImage
          class="icon-img"
          :src="'/icons/' + iconLeft + '.png'"
          @load="($event) => imgLoaded($event, 'left')"
        />
      </div>
      <slot name="left" />
      <form autocomplete="off" onsubmit="return false;">
        <input
          ref="inputref"
          v-bind="$attrs"
          class="inner-input-ele"
          :value="modelValue"
          @input="eventInput"
          @focus="eventFocus"
          @blur="eventBlur"
          :type="_type"
          :style="{ textAlign: align }"
          :maxlength="maxLength"
          autocomplete="off"
        />
      </form>
      <div v-if="clearable && modelValue && showClear" class="icon-clear">
        <AppImage src="/icons/dialog-close.png" @click="eventClear" />
      </div>
      <div v-if="isPwd" @click="togglePwd">
        <img
          :src="
            _type === 'password'
              ? '/icons/eye-close.png.webp'
              : '/icons/eye-open.png.webp'
          "
          :class="[_type === 'password' ? 'eye-close' : 'eye-open']"
        />
      </div>
      <div v-if="iconRight" class="icon-right">
        <AppImage
          class="icon-img"
          :src="'/icons/' + iconRight + '.png'"
          @load="($event) => imgLoaded($event, 'right')"
        />
      </div>
      <slot name="right" />
    </div>
    <div v-if="isShowError" class="error-msg" :style="errorMsgStyle">
      {{ _msg }}
    </div>
  </section>
</template>

<style lang="scss">
[theme="blue"]:root {
  --app-input-border-color: rgba(255, 255, 255, 0.25);
  --app-input-focused-border-color: #2fb7ff;
  --app-input-height: 72px;
  --app-input-border-radius: 100px;
}
</style>

<style lang="scss" scoped>
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.icon-img {
  width: 0;
}

.app-input-outer {
  position: relative;

  &.focused {
    .inner {
      border-color: var(--app-input-focused-border-color) !important;
    }
  }

  .inner {
    font-size: 26px;
    font-weight: 500;
    color: #969799;
    border-radius: 100px;
    border: 1px solid var(--app-input-border-color);
    background: linear-gradient(0deg, #000a1d 0%, #000a1d 100%), #2a2e3e;
    display: flex;
    align-items: center;

    .icon-left {
      width: 85px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    form {
      display: block;
      flex: 1;
      outline: none;
      border: 0;
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
    }

    input {
      width: 100%;
      flex: 1;
      outline: none;
      border: 0;
      background: transparent;
      font-size: 26px;
      color: #fff;
      line-height: 48px;
      -webkit-appearance: none;
      appearance: none;

      &::placeholder {
        color: #969799 !important;
      }
    }

    input:-webkit-autofill {
      // box-shadow: inset 0 0 0 2000px #000A1D; color: #fff;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: #fff;
    }

    input:autofill {
      // box-shadow: inset 0 0 0 2000px #000A1D; color: #fff;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: #fff;
    }

    .eye-close,
    .eye-open {
      width: 28px;
      margin: 0 24px 0 16px;
    }

    .icon-right {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
    }

    .icon-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 12px;

      img {
        width: 30px;
      }
    }
  }

  .error-msg {
    color: #ff690d;
    font-size: 24px;
    line-height: 36px;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -36px;
    white-space: nowrap;
  }
}
</style>
