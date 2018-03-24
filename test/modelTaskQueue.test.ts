import { ModelTaskQueue } from "../src/entities/modelTaskQueue";
import { TaskQueue } from "../src/entities/taskQueue";
import { ModelTaskMetadata, ModelComponent } from "../src/entities/modelTaskMetadata";
import { ModelData, Model } from "../src/entities/model";
import { Task } from "../src/entities/task";
import { PriorityGenerator } from "../src/entities/priorityPartitionedQueue";

function dequeueNonEmpty<TData, TMetadata>(queue: TaskQueue<Task<TData, TMetadata>>):
    Task<TData, TMetadata> {

    let result = queue.dequeue();
    expect(result).toBeDefined();
    return <Task<TData, TMetadata>> result;
}

describe("ModelTaskQueue Class", () => {
    it("can be created", () => {
        new ModelTaskQueue();
    });

    it("is initially empty", () => {
        let queue = new ModelTaskQueue();
        expect(queue.isEmpty()).toEqual(true);
        expect(queue.dequeue()).toBeUndefined();
    });

    it("supports enqueuing tasks", () => {
        let queue = new ModelTaskQueue();
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        expect(queue.isEmpty()).toEqual(false);
    });

    it("supports dequeuing tasks", () => {
        let count = 0;
        let queue = new ModelTaskQueue();
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { count++; },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        expect(queue.isEmpty()).toEqual(false);
        let task = dequeueNonEmpty(queue);
        task.execute(new ModelData());
        expect(queue.isEmpty()).toEqual(true);
        expect(count).toEqual(1);
    });

    it("supports dequeuing dependent tasks", () => {
        let count = 0;
        let queue = new ModelTaskQueue();
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { count++; },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { count++; },
                [ModelComponent.DataGraph],
                [ModelComponent.DataGraph]));
        expect(queue.isEmpty()).toEqual(false);
        dequeueNonEmpty(queue).execute(new ModelData());
        dequeueNonEmpty(queue).execute(new ModelData());
        expect(queue.isEmpty()).toEqual(true);
        expect(count).toEqual(2);
    });

    it("correctly prioritizes tasks", () => {
        let count = 0;
        let queue = new ModelTaskQueue();
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { if (count === 0) { count = 1; } },
                [],
                [ModelComponent.DataGraph],
                0));
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { if (count === 2) { count = 3; } },
                [ModelComponent.DataGraph],
                [],
                1));
        queue.enqueue(
            Model.createTask(
                (data: ModelData) => { if (count === 1) { count = 2; } },
                [ModelComponent.DataGraph],
                [],
                2));
        expect(queue.isEmpty()).toEqual(false);
        dequeueNonEmpty(queue).execute(new ModelData());
        dequeueNonEmpty(queue).execute(new ModelData());
        dequeueNonEmpty(queue).execute(new ModelData());
        expect(queue.isEmpty()).toEqual(true);
        expect(count).toEqual(3);
    });
});

describe("PriorityGenerator Class", () => {
    it("generates all-zeros by default", () => {
        let gen = new PriorityGenerator();
        for (let i = 0; i < 10; i++) {
            expect(gen.next()).toEqual(0);
        }
    });

    it("understands no-op notifications", () => {
        let gen = new PriorityGenerator();
        gen.notifyPriorityExists(0);
        for (let i = 0; i < 10; i++) {
            expect(gen.next()).toEqual(0);
        }
    });

    it("generates the right sequence between -2 and 3", () => {
        let gen = new PriorityGenerator();

        let expectation = [
            // One cycle.
            3,
            3, 2,
            3, 2, 1,
            3, 2, 1, 0,
            3, 2, 1, 0, -1,
            3, 2, 1, 0, -1, -2,
            // Once more, with feeling.
            3,
            3, 2,
            3, 2, 1,
            3, 2, 1, 0,
            3, 2, 1, 0, -1,
            3, 2, 1, 0, -1, -2
        ];

        gen.notifyPriorityExists(3);
        gen.notifyPriorityExists(-2);

        for (let i = 0; i < expectation.length; i++) {
            expect(gen.next()).toEqual(expectation[i]);
        }
    });
});