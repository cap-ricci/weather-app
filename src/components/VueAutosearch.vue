<style>
.autosearch__wrapper {
  box-sizing: border-box;
  font-size: 1rem;
  position: relative;
  text-align: left;
  width: 100%;
}

.autosearch__input {
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
  padding: 0.4rem;
  padding-right: 0.4rem + 1rem + 0.4rem;
  width: 100%;
}

.autosearch__input--openDown {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.autosearch__input--openUp {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.autosearch__loadingIndicator {
  animation-name: pulse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  border: 2px solid #ccc;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  height: 0.4rem;
  position: absolute;
  left: 0.2rem;
  top: 0.2rem;
  width: 0.4rem;
}

.autosearch__clearSearch {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 409.81 409.81"><defs/><path fill="%23aaa" d="M228.93 205.01L404.6 29.34c6.78-6.548 6.968-17.352.42-24.132s-17.352-6.968-24.132-.42c-.142.137-.282.277-.42.42l-175.67 175.67L29.128 5.208c-6.78-6.548-17.584-6.36-24.132.42-6.388 6.614-6.388 17.099 0 23.713l175.67 175.67-175.67 175.67c-6.663 6.664-6.663 17.468 0 24.132 6.664 6.662 17.468 6.662 24.132 0l175.67-175.67 175.67 175.67c6.78 6.548 17.584 6.36 24.132-.42 6.387-6.614 6.387-17.099 0-23.712l-175.67-175.67z" class="active-path" data-old_color="%23000000" data-original="%23000000"/></svg>');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  top: calc(50% - 0.5em);
  right: 0.4rem;
  height: 1rem;
  position: absolute;
  width: 1rem;
}

.autosearch__clearSearch:hover {
  cursor: pointer;
}

.autosearch__result {
  background-color: #ffffff;
  border: 1px solid lightgrey;
  box-sizing: border-box;
  position: absolute;
  overflow-y: auto;
  width: 100%;
  z-index: 1;
}
.autosearch__result--down {
  border-radius: 0 0 0.2rem 0.2rem;
  border-top: unset;
  margin-top: 0;
}

.autosearch__result--up {
  border-radius: 0.2rem 0.2rem 0 0;
  border-bottom: unset;
}
.autosearch__result__statusMessage {
  padding: 1rem;
}

.autosearch__result__option {
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 0.4rem;
}
.autosearch__result__option:hover {
  background-color: lightgrey;
}
@keyframes pulse {
  from {
    transform: scale(1);
  }

  50% {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}
</style>

<template>
  <div class='autosearch__wrapper'>
    <input
      :id='id'
      ref='inputElement'
      type='text'
      autocomplete='off'
      class='autosearch__input'
      :class='{
        "autosearch__input--openDown":
          showResults && showResultsDirection === Direction.DOWN,
        "autosearch__input--openUp":
          showResults && showResultsDirection === Direction.UP,
      }'
      :value='modelValue ? modelValue.name : searchTerm'
      :placeholder='placeholder'
      :disabled='disabled'
      @focus='showResults = true'
      @click='showResults = true'
      @input='searchInputHandler'
      @blur='showResults = false'
    />

    <span
      v-if='searchState === SearchState.LOADING'
      class='autosearch__loadingIndicator'
    />

    <span
      v-if='
        (searchTerm && searchTerm.length > 0) ||
        (modelValue && modelValue.name && modelValue.name.length > 0)
      '
      class='autosearch__clearSearch'
      @click='
        searchTerm = "";
        $emit("update:modelValue", null);
      '
    />

    <div
      v-show='showResults'
      ref='resultsElement'
      class='autosearch__result'
      :class='{
        "autosearch__result--down": showResultsDirection === Direction.DOWN,
        "autosearch__result--up": showResultsDirection === Direction.UP,
      }'
    >
      <div
        v-if='
          searchState === SearchState.DONE &&
          searchResults &&
          searchResults.length <= 0 &&
          !message
        '
        class='autosearch__result__statusMessage'
      >
        <slot name='noResults'> No results found </slot>
      </div>

      <div
        v-if='
          searchState === SearchState.LOADING &&
          (!searchResults || searchResults.length <= 0)
        '
        class='autosearch__result__statusMessage'
      >
        <slot name='loading'> Loading... </slot>
      </div>

      <div
        v-else-if='searchState === SearchState.ERROR'
        class='autosearch__result__statusMessage'
      >
        <slot name='error'> An error happened, please try again </slot>
      </div>

      <div
        v-else-if='searchState === SearchState.DONE && message'
        class='autosearch__result__statusMessage'
      >
        {{ message }}
      </div>

      <template
        v-if='
          (searchState === SearchState.DONE ||
            searchState === SearchState.LOADING) &&
          searchResults &&
          searchResults.length > 0
        '
      >
        <a
          v-for='option in searchResults'
          :key='option.id'
          class='autosearch__result__option'
          @mousedown.prevent='
            $emit("update:modelValue", option);
            showResults = false;
          '
          >{{ option.name }}</a
        >
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  Component, Prop, Watch, Vue, Emit,
} from 'vue-property-decorator';
// import { toRefs, ref, PropType, watch, Ref, nextTick } from 'vue';
import Place from '../types/Place';
import Direction from '../types/Direction';
import SearchState from '../types/SearchState';

@Component
export default class VueAutosearch extends Vue {
   Direction: any = Direction;

  SearchState: any = SearchState;

  private showResults = false;

  private inputElement: null | HTMLElement = null;

  private resultsElement: null | HTMLElement = null;

  private showResultsDirection = Direction.DOWN;

  private searchTerm = '';

  private message: null | string = null;

  private searchResults: null | Place[] = [];

  private searchState = SearchState.NONE;

  public dummy = '';

  private async filterAction(): Promise<void> {
    this.message = null;

    if (this.searchFunction !== null && this.options === null) {
      try {
        this.searchState = SearchState.LOADING;

        const result = await this.searchFunction(this.searchTerm);
        this.searchResults = result.result;
        this.message = result.message;

        this.searchState = SearchState.DONE;
      } catch {
        this.searchResults = [];
        this.searchState = SearchState.ERROR;
      }
    } else if (this.searchFunction === null && this.options !== null) {
      // if an options array will be passed, 'search' is already done,
      // as there's no external call required
      this.searchState = SearchState.DONE;

      let optionsToReturn = this.options;

      if (this.searchTerm.trim().length > 0) {
        optionsToReturn = optionsToReturn
          .filter((option) => option.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }

      this.searchResults = optionsToReturn;
    }
  }

  private async searchInputHandler(event: InputEvent) {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement.value;
    const cursorPosition = inputElement.selectionStart ?? searchValue.length;

    let manuallySetCursorPosition = false;

    this.showResults = true;

    if (this.modelValue !== null) {
      this.$emit('update:modelValue', null);
      await this.$nextTick();
      manuallySetCursorPosition = true;
    }

    this.searchTerm = searchValue;

    if (manuallySetCursorPosition === true) {
      await this.$nextTick();

      inputElement.setSelectionRange(cursorPosition, cursorPosition);
    }
  }

  private resetSearch() {
    if (this.modelValue === null) {
      this.searchTerm = '';
    }
  }

  @Prop({ default: null }) options!: Place[];

  @Prop({ default: null }) modelValue!: Place;

  @Prop({ default: 300 }) maxHeight!: number;

  @Prop({ default: null }) searchFunction!: (
    searchTerm: string
  ) => Promise<{ message: null | string; result: null | Place[] }>;

  @Prop({ default: '' }) placeholder!: string;

  @Prop({ default: false }) disabled!: boolean;

  @Prop({ default: null }) id!: string;

  @Emit('update:modelValue')
  updateModelValue(payload: null | Place): string | true | 0 {
    this.dummy = 'DUMMY';
    return payload === null || (payload.id && payload.name);
  }

  @Watch('showResults')
  onShowResultsChange() {
    if (
      this.showResults === true
      && this.inputElement !== null
      && this.resultsElement !== null
    ) {
      const elementBoundingClientRect = this.inputElement.getBoundingClientRect();

      const topDistance = elementBoundingClientRect.top;
      const bottomDistance = window.innerHeight - elementBoundingClientRect.bottom;

      this.resultsElement.style.maxHeight = `${this.maxHeight}px`;

      if (bottomDistance - 10 >= this.maxHeight) {
        this.showResultsDirection = Direction.DOWN;
        this.resultsElement.style.bottom = 'unset';
        this.resultsElement.style.maxHeight = `${this.maxHeight}px`;
      } else if (topDistance > bottomDistance) {
        this.showResultsDirection = Direction.UP;
        this.resultsElement.style.bottom = `${elementBoundingClientRect.height}px`;

        if (topDistance - 10 < this.maxHeight) {
          this.resultsElement.style.maxHeight = `${topDistance - 10}px`;
        }
      } else {
        this.showResultsDirection = Direction.DOWN;
        this.resultsElement.style.bottom = 'unset';

        if (bottomDistance - 10 < this.maxHeight) {
          this.resultsElement.style.maxHeight = `${bottomDistance - 10}px`;
        }
      }
    }
  }

  @Watch('searchTerm', { immediate: true })
  filterActionOnSearchTerm() {
    return this.filterAction();
  }

  @Watch('options', { immediate: true })
  filterActionOnOptions() {
    return this.filterAction();
  }

  @Watch('modelValue')
  resetSearchOnModelValue() {
    return this.resetSearch();
  }

  @Watch('disabled')
  resetSearchOnDisabled() {
    return this.resetSearch();
  }
}
</script>
