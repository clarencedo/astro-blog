---
title: "Actor Model"
publishDate: "17 March 2025"
description: "Actor 并发模型"
tags: ["actor", "design"]
---

# Actor Model

## 1. 核心概念

Actor Model 是一种并发计算模型，用于设计高并发、分布式系统。其核心思想是：
"万物皆Actor"，每个Actor是一个独立的计算单元，通过消息传递（Message Passing）进行通信，而非共享内存。

### 1.1 定义

Actor 的基本要素
组成部分 说明
状态（State） Actor内部维护的私有数据（其他Actor无法直接访问）
行为（Behavior） 定义Actor如何处理接收到的消息（类似一个消息处理函数）
邮箱（Mailbox） 存储接收到的消息队列（FIFO），确保消息有序处理
地址（Address） 每个Actor有唯一地址，用于接收消息
Actor Model是一种**并发计算模型**，基于三个基本原则：

1. 每个Actor是完全独立的计算单元
2. 只能通过异步消息进行通信
3. 自动处理失败隔离

### 1.2 核心组件

```go
type Actor struct {
    mailbox chan Message  // 消息邮箱（缓冲队列）
    state   interface{}   // 私有状态
    handler func(Message) // 消息处理函数
}
```

### 1.3 三大核心原则

1. \_封装性\_：Actor的状态是私有的，其他Actor无法直接访问。Actor的状态只能通过消息修改，不能直接共享内存（避免锁竞争）
2. **异步消息传递**：Actor之间仅通过消息通信，发送后立即继续执行（非阻塞）
3. **失败隔离**：Actor可以独立处理失败，其他Actor不受影响。失败的Actor可以被重启或替换，而不会影响系统的整体运行。

## 2. 为什么需要Actor Model

### 2.1 传统并发的问题

问题 Actor模型的解决方案
共享内存竞争 无共享内存，仅消息传递
死锁/锁开销 无锁设计，天然避免死锁
扩展性差 分布式场景天然适配（如跨机器通信）

### 2.2适用场景

- 高并发系统（如聊天应用，游戏引擎）
- 分布式计算（如Akka集群，Erlang/OTP)
- 容错系统（如分布式数据库，微服务架构）

### 2.3 Actor生命周期

```
sequenceDiagram
    participant Sender
    participant Receiver
    Sender->>Receiver: 异步发送消息
    Receiver->>Receiver: 消息入队邮箱
    Receiver->>Receiver: 顺序处理消息
```

### 2.4 Go伪代码

```go
type Message struct {
    Sender *Actor
    Data   interface{}
}

func (a *Actor) Run() {
    for msg := range a.mailbox {
        defer func() {
            if r := recover(); r != nil {
                a.handleFailure(r)
            }
        }()
        a.behavior(msg) // 处理消息
    }
}

// 父子监督机制
// 监督策略伪代码
type Supervisor struct {
    children []*Actor
    strategy func(*Actor, error) // 重启/停止策略
}

func (s *Supervisor) Monitor() {
    for _, child := range s.children {
        go func(a *Actor) {
            if err := a.Run(); err != nil {
                s.strategy(a, err)
            }
        }(child)
    }
}

// 远程Actor通信
// 跨网络通信伪代码
type RemoteActor struct {
    Address string
}

func (r *RemoteActor) Send(msg Message) {
    conn, _ := net.Dial("tcp", r.Address)
    gob.NewEncoder(conn).Encode(msg) // 序列化消息
}
```

```

## 3 Actor vs 传统线程模型
| 特性         | Actor Model                     | 传统线程模型                  |
|--------------|---------------------------------|-------------------------------|
| 并发单位     | Actor（轻量级，百万级）         | 线程（重量级，千级）          |
| 通信方式     | 消息传递（异步）                | 共享内存（需锁同步）          |
| 容错性       | 崩溃不影响其他Actor（隔离性）    | 线程崩溃可能导致整个进程挂掉   |
| 扩展性       | 天然支持分布式                  | 需额外框架（如gRPC）          |
| 设计复杂度   | 简单（Actor独立）               | 复杂（锁、条件变量等）        |


```
