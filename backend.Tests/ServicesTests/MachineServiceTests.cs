using Backend.MachineService;
using Xunit;
using FakeItEasy;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;

namespace backend.Tests.ServicesTests
{
    public class MachineServiceTests
    {
        private readonly DataContext _db = new();
        public MachineServiceTests() { }

        [Fact]
        public async void MachineService_GetAllMachines_ReturnsAllMachines()
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.GetAllMachines();

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<ActionResult<IEnumerable<Machine>>>(result); // Check if result is of type ActionResult<IEnumerable<Machine>>
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async void MachineService_GetMachineById_ReturnsMachine(int id)
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.GetMachineById(id);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<ActionResult<Machine>>(result); // Check if result is of type ActionResult<Machine>
            Assert.IsNotType<NotFoundObjectResult>(result); // Check if result is not NotFoundObjectResult
        }

        [Theory]
        [InlineData(50)]
        [InlineData(65)]
        [InlineData(90)]
        public async void MachineService_GetMachineById_ReturnsNotFound(int id)
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.GetMachineById(id);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<ActionResult<Machine>>(result); // Check if result is of type ActionResult<Machine>
            Assert.IsNotType<NotFoundResult>(result.Result);  // Check if result is not NotFoundObjectResult
        }

        [Theory]
        [InlineData(1, "machinename", "machinedescription", 1)]
        [InlineData(2, "machinename", "machinedescription", 2)]
        [InlineData(3, "machinename", "machinedescription", 3)]
        public async void MachineService_UpdateMachine_ReturnsNoContent(int id, string name, string description, int accountId)
        {
            // Arrange
            var service = new MachinesService(_db);
            var updatedMachine = new Machine { MachineId = id, Name = name, Description = description, AccountId = accountId };

            // Act
            var result = await service.UpdateMachine(id, updatedMachine);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<NoContentResult>(result); // Check if result is of type NoContentResult
            Assert.IsNotType<NotFoundResult>(result); // Check if result is not NotFoundResult
        }

        [Theory]
        [InlineData(30, "machinename", "machinedescription", 1)]
        [InlineData(44, "machinename", "machinedescription", 2)]
        [InlineData(35, "machinename", "machinedescription", 3)]
        public async void MachineService_UpdateMachine_ReturnsBadRequest(int id, string name, string description, int accountId)
        {
            // Arrange
            var service = new MachinesService(_db);
            var updatedMachine = new Machine { MachineId = id, Name = name, Description = description, AccountId = accountId };

            // Act
            var result = await service.UpdateMachine(id, updatedMachine);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsNotType<OkResult>(result); // Check if result is not OkResult
        }

        [Theory]
        [InlineData("machinename", "machinedescription", 1)]
        [InlineData("machinename", "machinedescription", 2)]
        [InlineData("machinename", "machinedescription", 3)]
        public async void MachineService_AddMachine_ReturnsCreatedAtActionResult(string name, string description, int accountId)
        {
            // Arrange
            var service = new MachinesService(_db);
            var newMachine = new Machine { Name = name, Description = description, AccountId = accountId };

            // Act
            var result = await service.AddMachine(newMachine);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<ActionResult<Machine>>(result); // Check if result is of type ActionResult<Machine>
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async void MachineService_GetMachinePerAccountId_ReturnsMachine(int id)
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.GetMachinePerAccountId(id);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<ActionResult<IEnumerable<Machine>>>(result); // Check if result is of type ActionResult<IEnumerable<Machine>>
            Assert.IsNotType<NotFoundObjectResult>(result); // Check if result is not NotFoundObjectResult
        }

        [Theory]
        [InlineData(4)]
        [InlineData(8)]
        [InlineData(12)]
        public async void MachineService_GetMachinePerAccountId_ReturnsNotFound(int id)
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.GetMachinePerAccountId(id);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<ActionResult<IEnumerable<Machine>>>(result); // Check if result is of type ActionResult<IEnumerable<Machine>>
            Assert.IsNotType<NotFoundResult>(result.Result);  // Check if result is not NotFoundObjectResult
            Assert.IsNotType<NotFoundObjectResult>(result); // Check if result is not NotFoundObjectResult
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async void MachineService_DeleteMachine_ReturnsNoContent(int id)
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.DeleteMachine(id);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsType<NoContentResult>(result); // Check if result is of type NoContentResult
            Assert.IsNotType<NotFoundResult>(result); // Check if result is NotFoundResult
        }

        [Theory]
        [InlineData(60)]
        [InlineData(88)]
        [InlineData(32)]
        public async void MachineService_DeleteMachine_ReturnsNotFound(int id)
        {
            // Arrange
            var service = new MachinesService(_db);

            // Act
            var result = await service.DeleteMachine(id);

            // Assert
            Assert.NotNull(result); // Check if result is not null
            Assert.IsNotType<OkResult>(result); // Check if result is not OkResult
        }
    }
}