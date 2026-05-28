"use client"

import { useState, useEffect } from "react"
import { Clock, Trash2 } from "lucide-react"

type Candidate = {
  id: number
  number: number
  name: string
  role: string
  bio: string
  votes: number
}

type Voter = {
  id: number
  address: string
}

const initialCandidates: Candidate[] = [
  {
    id: 1,
    number: 1,
    name: "김민준",
    role: "회장",
    bio: "적극적인 소통으로 모두가 행복한 학급을 만들겠습니다.",
    votes: 7,
  },
  {
    id: 2,
    number: 2,
    name: "이서연",
    role: "부회장",
    bio: "학급의 화합과 단결을 위해 최선을 다하겠습니다.",
    votes: 5,
  },
  {
    id: 3,
    number: 3,
    name: "박지호",
    role: "총무",
    bio: "투명하고 공정한 학급 운영을 약속드립니다.",
    votes: 4,
  },
  {
    id: 4,
    number: 4,
    name: "최예린",
    role: "서기",
    bio: "꼼꼼한 기록으로 학급 활동을 빠짐없이 남기겠습니다.",
    votes: 2,
  },
]

export default function ElectionPage() {
  const [activeTab, setActiveTab] = useState<"vote" | "results" | "admin">("vote")
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [votedCandidateId, setVotedCandidateId] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; candidate: Candidate | null }>({
    isOpen: false,
    candidate: null,
  })
  const [animateResults, setAnimateResults] = useState(false)
  const [voters, setVoters] = useState<Voter[]>([
    { id: 1, address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12" },
    { id: 2, address: "0x9876543210fedcba9876543210fedcba98765432" },
  ])
  const [totalVoters] = useState(32)
  const [electionEnded, setElectionEnded] = useState(false)

  // Admin state
  const [newVoterAddress, setNewVoterAddress] = useState("")
  const [newCandidateName, setNewCandidateName] = useState("")
  const [newCandidateRole, setNewCandidateRole] = useState("")
  const [newCandidateNumber, setNewCandidateNumber] = useState("")
  const [newCandidateBio, setNewCandidateBio] = useState("")
  const [startTime, setStartTime] = useState("2026-06-17T09:00")
  const [endTime, setEndTime] = useState("2026-06-17T11:50")
  const [isElectionActive, setIsElectionActive] = useState(true)

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)
  const maxVotes = Math.max(...candidates.map((c) => c.votes))

  // Live simulation
  useEffect(() => {
    if (activeTab !== "results" || electionEnded) return

    const interval = setInterval(() => {
      setCandidates((prev) => {
        const currentTotal = prev.reduce((sum, c) => sum + c.votes, 0)
        if (currentTotal >= totalVoters) {
          setElectionEnded(true)
          return prev
        }

        const randomIndex = Math.floor(Math.random() * prev.length)
        return prev.map((c, i) =>
          i === randomIndex ? { ...c, votes: c.votes + 1 } : c
        )
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [activeTab, electionEnded, totalVoters])

  const handleVote = (candidateId: number) => {
    if (votedCandidateId !== null) return
    const candidate = candidates.find((c) => c.id === candidateId)
    if (candidate) {
      setConfirmModal({ isOpen: true, candidate })
    }
  }

  const confirmVote = () => {
    if (!confirmModal.candidate || votedCandidateId !== null) return
    const candidateId = confirmModal.candidate.id
    setVotedCandidateId(candidateId)
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c))
    )
    setConfirmModal({ isOpen: false, candidate: null })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const cancelVote = () => {
    setConfirmModal({ isOpen: false, candidate: null })
  }

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab)
    if (tab === "results") {
      setAnimateResults(false)
      setTimeout(() => setAnimateResults(true), 50)
    }
  }

  const addVoter = () => {
    if (!newVoterAddress.trim()) return
    setVoters((prev) => [
      ...prev,
      { id: Date.now(), address: newVoterAddress.trim() },
    ])
    setNewVoterAddress("")
  }

  const removeVoter = (id: number) => {
    setVoters((prev) => prev.filter((v) => v.id !== id))
  }

  const addCandidate = () => {
    if (!newCandidateName.trim() || !newCandidateRole.trim() || !newCandidateNumber.trim()) return
    setCandidates((prev) => [
      ...prev,
      {
        id: Date.now(),
        number: parseInt(newCandidateNumber),
        name: newCandidateName.trim(),
        role: newCandidateRole.trim(),
        bio: newCandidateBio.trim(),
        votes: 0,
      },
    ])
    setNewCandidateName("")
    setNewCandidateRole("")
    setNewCandidateNumber("")
    setNewCandidateBio("")
  }

  const removeCandidate = (id: number) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#111827]">
            🗳️ 학급 임원 선거 2026
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F9FAFB] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-[#6B7280] font-mono">
                0x1a2b...3c4d
              </span>
            </div>
            <button className="text-sm text-[#6B7280] hover:text-[#111827]">
              연결 해제
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto flex">
          {[
            { key: "vote", label: "투표하기" },
            { key: "results", label: "실시간 결과" },
            { key: "admin", label: "관리자" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as typeof activeTab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-[#7C3AED] border-b-2 border-[#7C3AED]"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tab 1: Voting */}
        {activeTab === "vote" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-1">
                후보자를 선택하세요
              </h2>
              <p className="text-sm text-[#6B7280]">
                1인 1표 · 중복 투표 불가
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#F3F4F6] px-4 py-2 rounded-full mb-8">
              <Clock className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">
                투표 기간: 2026.06.17 09:00 ~ 11:50
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`relative bg-white rounded-xl p-5 border ${
                    votedCandidateId === candidate.id
                      ? "border-2 border-[#7C3AED]"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  <span className="inline-block bg-[#EDE9FE] text-[#7C3AED] text-xs font-medium px-2 py-1 rounded mb-3">
                    기호 {candidate.number}번
                  </span>

                  {votedCandidateId === candidate.id && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      ✓ 투표 완료
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-[#111827] mb-1">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-[#7C3AED] font-medium mb-2">
                    {candidate.role}
                  </p>
                  <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                    {candidate.bio}
                  </p>

                  <button
                    onClick={() => handleVote(candidate.id)}
                    disabled={votedCandidateId !== null}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      votedCandidateId !== null
                        ? "border border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                        : "border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
                    }`}
                  >
                    투표하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Results */}
        {activeTab === "results" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#111827]">
                실시간 투표 현황
              </h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-sm font-medium text-green-600">LIVE</span>
              </div>
            </div>

            {electionEnded && (
              <div className="bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] px-4 py-3 rounded-lg mb-6 text-sm font-medium">
                투표가 종료되었습니다
              </div>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#EDE9FE] rounded-xl p-4">
                <p className="text-sm text-[#6B7280] mb-1">총 유권자</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {totalVoters}명
                </p>
              </div>
              <div className="bg-[#E0F2FE] rounded-xl p-4">
                <p className="text-sm text-[#6B7280] mb-1">투표 완료</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {totalVotes}명
                </p>
              </div>
              <div className="bg-[#D1FAE5] rounded-xl p-4">
                <p className="text-sm text-[#6B7280] mb-1">투표율</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {((totalVotes / totalVoters) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#111827] mb-6">
                후보별 득표 현황
              </h3>
              <div className="space-y-4">
                {candidates
                  .slice()
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate) => {
                    const percentage =
                      totalVotes > 0
                        ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                        : "0.0"
                    const isLeading = candidate.votes === maxVotes && maxVotes > 0

                    return (
                      <div key={candidate.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#111827]">
                              {candidate.name}
                            </span>
                            <span className="text-xs bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded">
                              {candidate.role}
                            </span>
                            {isLeading && (
                              <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded font-medium">
                                🏆 선두
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-[#6B7280]">
                            {candidate.votes}표 ({percentage}%)
                          </span>
                        </div>
                        <div className="h-10 bg-[#F3F4F6] rounded overflow-hidden">
                          <div
                            className={`h-full rounded-r transition-all duration-[800ms] ease-out ${
                              isLeading ? "bg-[#5B21B6]" : "bg-[#7C3AED]"
                            }`}
                            style={{
                              width: animateResults
                                ? maxVotes > 0
                                  ? `${(candidate.votes / maxVotes) * 100}%`
                                  : "0%"
                                : "0%",
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            <p className="mt-6 text-sm text-[#6B7280] flex items-center gap-2">
              ⚠️ 투표 마감 후 최종 결과가 확정됩니다
            </p>
          </div>
        )}

        {/* Tab 3: Admin */}
        {activeTab === "admin" && (
          <div className="space-y-8">
            {/* Section A: Voter Registration */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#111827] mb-4">
                유권자 등록
              </h3>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="지갑 주소 입력 (0x...)"
                  value={newVoterAddress}
                  onChange={(e) => setNewVoterAddress(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
                <button
                  onClick={addVoter}
                  className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-medium rounded-lg hover:bg-[#5B21B6] transition-colors"
                >
                  등록하기
                </button>
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {voters.map((voter) => (
                  <div
                    key={voter.id}
                    className="flex items-center justify-between py-2 px-3 bg-[#F9FAFB] rounded-lg"
                  >
                    <span className="text-sm font-mono text-[#6B7280]">
                      {voter.address}
                    </span>
                    <button
                      onClick={() => removeVoter(voter.id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Section B: Candidate Registration */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#111827] mb-4">
                후보자 등록
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="이름"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="직책"
                  value={newCandidateRole}
                  onChange={(e) => setNewCandidateRole(e.target.value)}
                  className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="number"
                  placeholder="기호번호"
                  value={newCandidateNumber}
                  onChange={(e) => setNewCandidateNumber(e.target.value)}
                  className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="소개글"
                  value={newCandidateBio}
                  onChange={(e) => setNewCandidateBio(e.target.value)}
                  className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
              </div>
              <button
                onClick={addCandidate}
                className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-medium rounded-lg hover:bg-[#5B21B6] transition-colors"
              >
                후보 추가
              </button>

              <div className="mt-4 space-y-2">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between py-2 px-3 bg-[#F9FAFB] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-[#EDE9FE] text-[#7C3AED] px-2 py-0.5 rounded font-medium">
                        기호 {candidate.number}
                      </span>
                      <span className="text-sm font-medium text-[#111827]">
                        {candidate.name}
                      </span>
                      <span className="text-sm text-[#6B7280]">
                        {candidate.role}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCandidate(candidate.id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Section C: Election Settings */}
            <section className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#111827] mb-4">
                선거 설정
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">
                    시작 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">
                    종료 시간
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-[#F9FAFB] rounded-lg mb-4">
                <span className="text-sm font-medium text-[#111827]">
                  선거 활성화
                </span>
                <button
                  onClick={() => setIsElectionActive(!isElectionActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isElectionActive ? "bg-[#7C3AED]" : "bg-[#D1D5DB]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isElectionActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-medium rounded-lg hover:bg-[#5B21B6] transition-colors">
                설정 저장
              </button>
            </section>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          투표가 완료되었습니다 ✓
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.candidate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={cancelVote}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#111827] mb-2 text-center">
              투표 확인
            </h3>
            <p className="text-sm text-[#6B7280] mb-6 text-center">
              {confirmModal.candidate.name} 후보에게 투표하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelVote}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-[#7C3AED] text-white hover:bg-[#5B21B6] transition-colors"
              >
                투표 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
