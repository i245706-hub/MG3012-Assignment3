// SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;

 contract TaskManager {

     struct Task {
         string description;
         bool completed;
     }

     Task[] public tasks;

     function addTask(string memory _description) public {
         tasks.push(Task(_description, false));
     }

     function toggleTask(uint _index) public {
         require(_index < tasks.length, "Invalid task number");
         tasks[_index].completed = !tasks[_index].completed;
     }

     function getTask(uint _index)
         public view returns (string memory, bool) {
         require(_index < tasks.length, "Invalid task number");
         return (tasks[_index].description, tasks[_index].completed);
     }

     function getTaskCount() public view returns (uint) {
         return tasks.length;
     }
 }