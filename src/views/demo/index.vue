<template>
  <el-button type="primary" @click="submit" :loading="loading">开始</el-button>
  <el-dialog v-model="dialogVisible" title="Tips" width="30%">
    {{ `第${submitIndex}数据失败是否需要重试` }}
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  {{ selectedValues.slice(submitIndex) }}
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'

const fetchData = id => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { 
      console.log(id)
      Math.random() > 0.5 ? resolve(id) : reject(id);
     }, 2000)
  })
}
const loading = ref(false);

const dialogVisible = ref(false);
// 选中的数据
const selectedValues = ref([1,2,3,4,5,6,7,8,9,10]);
// 当前提交的数据索引
const submitIndex = ref(0);

const resetData = () => {
  selectedValues.value = [];
  submitIndex.value = 0;
  console.log('此时该刷新数据')
}

// 提交的数据
const submit = async () => {
  try {
    loading.value = true;
    const againValues = selectedValues.value.slice(submitIndex.value);
    for(let i = 0; i < againValues.length; i++) {
      submitIndex.value++;
      await fetchData(againValues[i]);
    }
    if(submitIndex.value === selectedValues.value.length) {
      ElMessage.success('全部成功');
      resetData()
    }
  } catch (error) {
    dialogVisible.value = true;
  } finally {
    loading.value = false;
  }
}

const confirm = () => {
  dialogVisible.value = false;
  submitIndex.value--;
  submit();
}
const cancel = () => {
  dialogVisible.value = false;
  if(submitIndex.value > 0) {
    resetData()
  }
}


</script>