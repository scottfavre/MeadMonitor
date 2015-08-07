BEGIN TRANSACTION

BEGIN TRY
	CREATE TABLE [dbo].[Devices](
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[Address] [nvarchar](50) NOT NULL,
		[Name] [nvarchar](200) NULL,
		CONSTRAINT [PK_Devices] PRIMARY KEY CLUSTERED ( [Id] ASC ),
		CONSTRAINT [UQ_Devices_Address] UNIQUE ([Address])
	);

	CREATE TABLE [dbo].[Batches](
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[Name] [nvarchar](200) NOT NULL,
		[Series] [nvarchar](200) NULL,
		[Sequence] [int] NULL,
		[StartDate] [datetime] NULL,
		[EndDate] [datetime] NULL,
		CONSTRAINT [PK_Batches] PRIMARY KEY CLUSTERED ( [Id] ASC )
	);

	CREATE TABLE [dbo].[BatchMonitors] (
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[BatchId] [int] NOT NULL,
		[DeviceId] [int] NOT NULL,
		[StartDate] [datetime] NOT NULL,
		[EndDate] [datetime] NULL,
		CONSTRAINT [PK_BatchMonitors] PRIMARY KEY CLUSTERED ( [Id] ASC ),
		CONSTRAINT [FK_BatchMonitor_to_Batches] FOREIGN KEY (BatchId) REFERENCES [dbo].[Batches] (Id),
		CONSTRAINT [FK_BatchMonitor_to_Devices] FOREIGN KEY (DeviceId) REFERENCES [dbo].[Devices] (Id)
	);
	
	CREATE TABLE [dbo].[Temperature](
		[Id] [bigint] IDENTITY(1,1) NOT NULL,
		[MonitorId] [int] NOT NULL,
		[Temperature] [float] NOT NULL,
		[Timestamp] [datetime] NOT NULL,
	 	CONSTRAINT [PK_Temperature] PRIMARY KEY CLUSTERED ( [Id] ASC ),
		CONSTRAINT [FK_Temperature_to_BatchMonitor] FOREIGN KEY (MonitorId) REFERENCES [dbo].[BatchMonitors] (Id)
	);
END TRY
BEGIN CATCH
	SELECT CAST(0 AS BIT), 0, NULL, ERROR_MESSAGE();
	ROLLBACK;
	RETURN;
END CATCH

COMMIT
GO