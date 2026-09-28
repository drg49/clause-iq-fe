import { act, renderHook, waitFor } from "@testing-library/react";

import useContracts from "./useContracts";
import { getContracts } from "../api/contracts";

jest.mock("../api/contracts", () => ({
  getContracts: jest.fn(),
  uploadContract: jest.fn(),
  deleteContract: jest.fn(),
}));

describe("useContracts", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("refetches every 10 seconds while a contract is analyzing", async () => {
    getContracts
      .mockResolvedValueOnce({
        contracts: [
          {
            id: 1,
            name: "Test contract",
            status: "ANALYZING",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
        pagination: { total: 1 },
      })
      .mockResolvedValueOnce({
        contracts: [
          {
            id: 1,
            name: "Test contract",
            status: "ANALYZED",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
        pagination: { total: 1 },
      });

    const { result } = renderHook(() => useContracts());

    await waitFor(() => {
      expect(result.current.contracts).toHaveLength(1);
      expect(result.current.contracts[0].status).toBe("ANALYZING");
    });

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(getContracts).toHaveBeenCalledTimes(2);
      expect(result.current.contracts[0].status).toBe("ANALYZED");
    });
  });
});
