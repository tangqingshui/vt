import { ref, computed, readonly, watch } from 'vue';
import { defineStore } from 'pinia';

import { fetch,  generateId, save} from '@/util/todoStorage';

// vue3响应式api实现高内聚
export const useTodoListStore = defineStore('todoList', () => {

  const todoList = ref(fetch());
  watch(todoList, val => {
    save(val)
  },{
    deep: true
  })
  const addTodo = todo => {
    todoList.value.push({
      id: generateId(),
      title: todo,
      completed: false,
    })
  }
  const editTodo = id => {
    todoList.value = todoList.value.map( i => {
      if(i.id === id) {
        return {
          ...i,
          editing: true,
        }
      }

      return i;
    })
  }
  const doneEdit = (id,title) => {
    todoList.value = todoList.value.map( i => {
      if(i.id === id) {
        return {
          ...i,
          title,
          editing: false,
        }
      }

      return i;
    })
  }
  const cancelEdit = id => {
    todoList.value = todoList.value.map( i => {
      if(i.id === id) {
        return {
          ...i,
          editing: false,
        }
      }

      return i;
    })
  }
  const removeTodo = id => {
    todoList.value = todoList.value.filter( i => i.id !== id);
  }

  const isAllCheckedTodo = computed(() => {
    return todoList.value.every(i => i.completed);
  })
  const setChecked = (id,isChecked) => {
    todoList.value = todoList.value.map( i => {
      if(i.id === id) {
        return {
          ...i,
          completed: isChecked,
        }
      }

      return i;
    })
  }
  const setAllChecked = isAllChecked => {
    todoList.value = todoList.value.map( i => {
      return {
        ...i,
        completed: isAllChecked,
      }
    })
  }

  const activeKey = ref('all');
  const setActiveKey = key => {
    activeKey.value = key;
  }
  const activeTodoList = computed(() => {
   
    return todoList.value.filter(i => {
      if(activeKey.value === 'all') {
        return true;
      }

      if(activeKey.value === 'active') {
        return !i.completed;
      }

      if(activeKey.value === 'completed') {
        return i.completed;
      }

      return true;
    })
  })
  const activeTodoListLength = computed(() => {
    return activeTodoList.value.length;
  })

  return {
    addTodo,
    editTodo,
    removeTodo,
    isAllCheckedTodo,
    setAllChecked,
    setChecked,
    doneEdit,
    cancelEdit,
    activeKey: readonly(activeKey),
    activeTodoList,
    activeTodoListLength,
    setActiveKey
  }
})


