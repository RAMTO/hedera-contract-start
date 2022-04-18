//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Todo {
  struct TodoItem {
    string title;
    bool status;
  }

  mapping(bytes32 => TodoItem) public idTodoItems;
  bytes32[] public todoItemIds;

  function addTodo(string calldata _title) external {
    bytes32 itemId = keccak256(abi.encodePacked(_title));
    idTodoItems[itemId] = TodoItem(_title, false);
    todoItemIds.push(itemId);
  }

  function toggleTodo(bytes32 _itemId) external {
    idTodoItems[_itemId].status = !idTodoItems[_itemId].status;
  }

  function getTodoItemsIdsLength() external view returns (uint256) {
    return todoItemIds.length;
  }
}
