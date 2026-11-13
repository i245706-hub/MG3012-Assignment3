const TaskManager = artifacts.require("TaskManager");

contract("TaskManager", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await TaskManager.new();
  });

  it("starts with zero tasks", async () => {
    const count = await instance.getTaskCount();
    assert.equal(count.toNumber(), 0);
  });

  it("adds a task", async () => {
    await instance.addTask("Write report");
    const count = await instance.getTaskCount();
    const task = await instance.getTask(0);
    assert.equal(count.toNumber(), 1);
    assert.equal(task[0], "Write report");
    assert.equal(task[1], false);
  });

  it("toggles a task", async () => {
    await instance.addTask("Write report");
    await instance.toggleTask(0);
    let task = await instance.getTask(0);
    assert.equal(task[1], true);
    await instance.toggleTask(0);
    task = await instance.getTask(0);
    assert.equal(task[1], false);
  });

  it("rejects an invalid index", async () => {
    try {
      await instance.getTask(5);
      assert.fail("Should have thrown");
    } catch (err) {
      assert.include(err.message, "Invalid task number");
    }
  });
});