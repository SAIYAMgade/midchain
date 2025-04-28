// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    event DataStored(address indexed sender, uint256 data);

    function store(uint256 _data) external {
        storedData = _data;
        emit DataStored(msg.sender, _data);
    }

    function retrieve() external view returns (uint256) {
        return storedData;
    }
}
