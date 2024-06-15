// frontend/src/components/TaskList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // 編集中のタスクを管理するステートを追加
  const [openEditDialog, setOpenEditDialog] = useState(false); // 編集ダイアログの開閉を管理するステートを追加
  const [editedTaskTitle, setEditedTaskTitle] = useState(''); // 編集中のタスクのタイトルを管理するステートを追加
  const [editedTaskDescription, setEditedTaskDescription] = useState(''); // 編集中のタスクの説明を管理するステートを追加

  useEffect(() => {
    fetchTasks();
  }, []);

  // タスク一覧を取得する関数
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

  // タスクの削除処理
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      fetchTasks(); // タスク削除後にタスク一覧を再取得する
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  // タスクの編集処理
  const handleEdit = async (taskId) => {
    try {
      // タスクIDを元に、バックエンドから該当するタスクの情報を取得
      const response = await axios.get(`http://localhost:5000/tasks/${taskId}`);
      const taskToEdit = response.data;

      // 取得したタスクの情報を編集用のステートに保存する
      setEditingTask(taskToEdit);
      setEditedTaskTitle(taskToEdit.title); // 編集中のタスクのタイトルをセット
      setEditedTaskDescription(taskToEdit.description); // 編集中のタスクの説明をセット
      setOpenEditDialog(true); // 編集ダイアログを開く

    } catch (error) {
      console.error('Error fetching task for editing: ', error);
    }
  };

  // 編集ダイアログを閉じる処理
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    // 編集用のステートを初期化する
    setEditingTask(null);
    setEditedTaskTitle('');
    setEditedTaskDescription('');
  };

  // 編集フォームの入力内容を更新する処理
  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setEditedTaskTitle(value);
    } else if (name === 'description') {
      setEditedTaskDescription(value);
    }
  };

  // タスクの更新処理
  const handleUpdateTask = async () => {
    try {
      const updatedTask = { ...editingTask, title: editedTaskTitle, description: editedTaskDescription };
      await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, updatedTask);
      fetchTasks(); // タスク更新後にタスク一覧を再取得する
      handleCloseEditDialog(); // 編集ダイアログを閉じる
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  return (
    <>
      <List>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <ListItemText primary={task.title} secondary={task.description} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(task._id)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* 編集ダイアログ */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={editedTaskTitle}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editedTaskDescription}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTask} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskList;
